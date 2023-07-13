import React, { useCallback } from "react";

import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import ChatTemplate from "../components/templates/ChatTemplate";
import { useDeleteCommunity } from "../hooks/community/mutate";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CommunityStackParamList, CommunityStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useInfiniteQueryCommunities } from "../hooks/community/query";
import useImage from "../hooks/sdk/useImage";
import { useQueryUser } from "../hooks/user/query";
import {
  useDeleteChat,
  usePostChat,
  usePostCommunityChatImage,
} from "../hooks/chat/mutate";
import { useCommunityChat } from "../hooks/chat";
import { useInfiniteQueryCommunityChats } from "../hooks/chat/query";

const CommunityChatScreen = ({
  navigation,
}: CommunityStackScreenProps<"CommunityChat">) => {
  const { t } = useTranslation("chat");
  const toast = useToast();
  const { session, locale } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { params } =
    useRoute<RouteProp<CommunityStackParamList, "CommunityChat">>();
  const { refetch: refetchCommunities } = useInfiniteQueryCommunities(
    params.category
  );
  const {
    data: chats,
    isLoading: isLoadingChats,
    hasNextPage: hasMore,
    fetchNextPage,
    refetch: refetchChats,
  } = useInfiniteQueryCommunityChats(params.communityId);

  useCommunityChat(params.communityId, async () => {
    await refetchChats();
  });

  const { mutateAsync: mutateAsyncPostChat, isLoading: isLoadingPostChat } =
    usePostChat({
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      },
    });

  const { mutateAsync: mutateAsyncDeleteChat } = useDeleteChat({
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const { mutateAsync: mutateAsyncDeleteCommunity } = useDeleteCommunity({
    onSuccess: async () => {
      await refetchCommunities();
      navigation.goBack();
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const { mutateAsync: mutateAsyncPostChatImage } = usePostCommunityChatImage({
    onSuccess: async () => {
      await refetchChats();
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const { pickImageByCamera, pickImageByLibrary } = useImage({
    onSuccess: async ({ base64, size }) => {
      if (session?.user && base64) {
        await mutateAsyncPostChatImage({
          base64,
          size,
          communityId: params.communityId,
          authorId: session?.user.id,
        });
      }
    },
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestCam")}
        />
      );
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const onSend = useCallback(
    async (message: string) => {
      session &&
        (await mutateAsyncPostChat({
          message,
          communityId: params.communityId,
          authorId: session.user.id,
        }));
    },
    [session?.user]
  );

  const deleteChat = useCallback(async (chatId: number | null) => {
    await mutateAsyncDeleteChat(chatId);
  }, []);

  const deleteCommunity = useCallback(async () => {
    await mutateAsyncDeleteCommunity(params.communityId);
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ChatTemplate
      type="community"
      locale={locale}
      title={params.name}
      user={user}
      chats={chats}
      deleteRoom={deleteCommunity}
      deleteChat={deleteChat}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      onSend={onSend}
      readMore={fetchNextPage}
      isLoadingChats={isLoadingChats}
      isLoadingPostChat={isLoadingPostChat}
      hasMore={hasMore}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default CommunityChatScreen;
