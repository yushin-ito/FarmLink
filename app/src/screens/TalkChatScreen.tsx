import React, { useCallback } from "react";

import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import ChatTemplate from "../components/templates/ChatTemplate";
import { usePostTalkChat, usePostTalkChatImage } from "../hooks/talk/mutate";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { TalkStackParamList } from "../types";
import useTalkChat from "../hooks/talk/useTalkChat";
import useAuth from "../hooks/auth/useAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useInfiniteQueryTalkChats } from "../hooks/talk/query";
import useImage from "../hooks/sdk/useImage";
import { useQueryUser } from "../hooks/user/query";

type TalkChatNavigationProp = NativeStackNavigationProp<
  TalkStackParamList,
  "TalkChat"
>;

type TalkChatRouteProp = RouteProp<TalkStackParamList, "TalkChat">;

const TalkChatScreen = () => {
  const { t } = useTranslation("talk");
  const toast = useToast();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { params } = useRoute<TalkChatRouteProp>();
  const navigation = useNavigation<TalkChatNavigationProp>();
  const {
    data: chats,
    isLoading: isLoadingChats,
    hasNextPage: hasMore,
    fetchNextPage,
    refetch,
  } = useInfiniteQueryTalkChats(params.talkId);

  useTalkChat(params.talkId, async () => {
    await refetch();
  });

  const { mutateAsync: mutateAsyncPostChat } = usePostTalkChat({
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

  const { mutateAsync: mutateAsyncPostImage } = usePostTalkChatImage({
    onSuccess: async () => {
      await refetch();
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
    onSuccess: async ({ base64, type, size }) => {
      if (session?.user && base64 && type) {
        await mutateAsyncPostImage({
          base64,
          type,
          talkId: params.talkId,
          authorId: session?.user.id,
          size,
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

  const postChat = useCallback(async (message: string) => {
    await mutateAsyncPostChat({
      message,
      talkId: params.talkId,
      authorId: session?.user.id,
    });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ChatTemplate
      title={params.displayName}
      user={user}
      chats={chats}
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

export default TalkChatScreen;
