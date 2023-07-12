import React, { useCallback } from "react";

import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import ChatTemplate from "../components/templates/ChatTemplate";
import {
  useDeleteTalk,
  usePostTalk,
  usePostTalkChat,
  usePostTalkChatImage,
} from "../hooks/talk/mutate";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TalkStackParamList, TalkStackScreenProps } from "../types";
import useChat from "../hooks/talk/useChat";
import useAuth from "../hooks/auth/useAuth";
import { useInfiniteQueryTalkChats, useQueryTalks } from "../hooks/talk/query";
import useImage from "../hooks/sdk/useImage";
import { useQueryUser } from "../hooks/user/query";

const TalkChatScreen = ({ navigation }: TalkStackScreenProps<"TalkChat">) => {
  const { t } = useTranslation("talk");
  const toast = useToast();
  const { session, locale } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { params } = useRoute<RouteProp<TalkStackParamList, "TalkChat">>();
  const { refetch: refetchTalks } = useQueryTalks(session?.user.id);
  const {
    data: chats,
    isLoading: isLoadingChats,
    hasNextPage: hasMore,
    fetchNextPage,
    refetch: refetchChats,
  } = useInfiniteQueryTalkChats(params.talkId);

  useChat(params.talkId, async () => {
    await refetchChats();
  });

  const { mutateAsync: mutateAsyncPostTalk } = usePostTalk({
    onSuccess: async () => {
      await refetchTalks();
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

  const { mutateAsync: mutateAsyncDeleteTalk } = useDeleteTalk({
    onSuccess: async () => {
      await refetchTalks();
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

  const { mutateAsync: mutateAsyncPostChat, isLoading: isLoadingPostChat } =
    usePostTalkChat({
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

  const { mutateAsync: mutateAsyncPostChatImage } = usePostTalkChatImage({
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
      session &&
        base64 &&
        (await mutateAsyncPostChatImage({
          base64,
          talkId: params.talkId,
          authorId: session.user.id,
          size,
        }));
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
      await mutateAsyncPostTalk({
        talkId: params.talkId,
        lastMessage: message,
      });
      session &&
        (await mutateAsyncPostChat({
          message,
          talkId: params.talkId,
          authorId: session.user.id,
        }));
    },
    [session?.user]
  );

  const deleteTalk = useCallback(async () => {
    await mutateAsyncDeleteTalk(params.talkId);
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ChatTemplate
      type="talk"
      locale={locale}
      title={params.name}
      user={user}
      chats={chats}
      onSend={onSend}
      deleteRoom={deleteTalk}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      readMore={fetchNextPage}
      isLoadingChats={isLoadingChats}
      isLoadingPostChat={isLoadingPostChat}
      hasMore={hasMore}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default TalkChatScreen;
