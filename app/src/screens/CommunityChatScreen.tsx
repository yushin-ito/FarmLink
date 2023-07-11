import React, { useCallback } from "react";

import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import ChatTemplate from "../components/templates/ChatTemplate";
import {
  useDeleteCommunity,
  usePostCommunityChat,
  usePostCommunityChatImage,
} from "../hooks/community/mutate";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CommunityStackParamList } from "../types";
import useChat from "../hooks/community/useChat";
import useAuth from "../hooks/auth/useAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useInfiniteQueryCommunities,
  useInfiniteQueryCommunityChats,
} from "../hooks/community/query";
import useImage from "../hooks/sdk/useImage";
import { useQueryUser } from "../hooks/user/query";

type CommunityChatNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  "CommunityChat"
>;

type CommunityChatRouteProp = RouteProp<
  CommunityStackParamList,
  "CommunityChat"
>;

const CommunityChatScreen = () => {
  const { t } = useTranslation("chat");
  const toast = useToast();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { params } = useRoute<CommunityChatRouteProp>();
  const navigation = useNavigation<CommunityChatNavigationProp>();
  const { refetch: refetchCommunities } = useInfiniteQueryCommunities(
    params.category
  );
  const {
    data: chats,
    isLoading: isLoadingChats,
    hasNextPage: hasMore,
    fetchNextPage,
    refetch: refetchCommunityChats,
  } = useInfiniteQueryCommunityChats(params.communityId);

  useChat(params.communityId, async () => {
    await refetchCommunityChats();
  });

  const { mutateAsync: mutateAsyncPostChat } = usePostCommunityChat({
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("anyError")}
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
          text={t("anyError")}
        />
      );
    },
  });

  const { mutateAsync: mutateAsyncPostChatImage } = usePostCommunityChatImage({
    onSuccess: async () => {
      await refetchCommunityChats();
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("anyError")}
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
          text={t("anyError")}
        />
      );
    },
  });

  const postChat = useCallback(
    async (message: string) => {
      await mutateAsyncPostChat({
        message,
        communityId: params.communityId,
        authorId: session?.user.id,
      });
    },
    [session?.user]
  );

  const deleteCommunity = useCallback(async () => {
    await mutateAsyncDeleteCommunity(params.communityId);
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ChatTemplate
      type="community"
      title={params.communityName}
      user={user}
      chats={chats}
      deleteRoom={deleteCommunity}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      postChat={postChat}
      readMore={fetchNextPage}
      isLoadingChats={isLoadingChats}
      hasMore={hasMore}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default CommunityChatScreen;
