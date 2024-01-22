import React, { useCallback, useEffect } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import TalkChatTemplate from "../components/templates/TalkChatTemplate";
import { showAlert } from "../functions";
import {
  useDeleteChat,
  usePostChat,
  usePostChatImage,
} from "../hooks/chat/mutate";
import { useInfiniteQueryTalkChats } from "../hooks/chat/query";
import { usePostNotification } from "../hooks/notification/mutate";
import useImage from "../hooks/sdk/useImage";
import useNotification from "../hooks/sdk/useNotification";
import { useDeleteTalk, useUpdateTalk } from "../hooks/talk/mutate";
import { useQueryTalk } from "../hooks/talk/query";
import { useQueryUser } from "../hooks/user/query";
import { supabase } from "../supabase";
import { TalkStackParamList, TalkStackScreenProps } from "../types";

const TalkChatScreen = ({ navigation }: TalkStackScreenProps<"TalkChat">) => {
  const { t } = useTranslation("chat");
  const toast = useToast();
  const { params } = useRoute<RouteProp<TalkStackParamList, "TalkChat">>();

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const { data: talk, isLoading: isLoadingTalk } = useQueryTalk(params.talkId);
  const {
    data: chats,
    isLoading: isLoadingChats,
    hasNextPage: hasMore,
    fetchNextPage,
    refetch: refetchChats,
  } = useInfiniteQueryTalkChats(params.talkId);

  useEffect(() => {
    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `talkId=eq.${params.talkId}`,
        },
        async () => {
          await refetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params]);

  const { mutateAsync: mutateAsyncUpdateTalk } = useUpdateTalk({
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

  const { mutateAsync: mutateAsyncDeleteTalk, isPending: isLoadingDeleteTalk } =
    useDeleteTalk({
      onSuccess: async () => {
        navigation.goBack();
        showAlert(
          toast,
          <Alert
            status="success"
            onPressCloseButton={() => toast.closeAll()}
            text={t("deleted")}
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

  const {
    mutateAsync: mutateAsyncPostNotification,
    isPending: isLoadingPostNotification,
  } = usePostNotification({
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

  const { mutateAsync: mutateAsyncPostChat, isPending: isLoadingPostChat } =
    usePostChat({
      onSuccess: async ({ chatId, authorId, message, imageUrl }) => {
        if (talk?.to.token && user?.name) {
          message &&
            (await sendNotification({
              to: talk.to.token,
              title: user.name,
              body: message,
              data: {
                scheme: `TabNavigator/TalkNavigator/TalkChat?talkId=${params.talkId}`,
              },
            }));
          imageUrl &&
            (await sendNotification({
              to: talk.to.token,
              title: user.name,
              body: "写真が送信されました。",
              data: {
                scheme: `TabNavigator/TalkNavigator/TalkChat?talkId=${params.talkId}`,
              },
            }));
        }
        if (talk?.to.userId) {
          await mutateAsyncPostNotification({
            recieverId: talk.to.userId,
            senderId: authorId,
            talkId: params.talkId,
            clicked: false,
          });
        }
        await mutateAsyncUpdateTalk({
          talkId: params.talkId,
          chatId,
        });
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

  const { mutateAsync: mutateAsyncPostChatImage } = usePostChatImage({
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

  const {
    isLoading: isLoadingPickImage,
    pickImageByCamera,
    pickImageByLibrary,
  } = useImage({
    onSuccess: async ({ base64, size }) => {
      if (user && base64) {
        const { path } = await mutateAsyncPostChatImage(base64);
        const { data } = supabase.storage.from("image").getPublicUrl(path);
        await mutateAsyncPostChat({
          talkId: params.talkId,
          authorId: user.userId,
          imageUrl: data.publicUrl,
          width: size.width,
          height: size.height,
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

  const { sendNotification } = useNotification({
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestNoti")}
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
      if (user) {
        await mutateAsyncPostChat({
          message,
          talkId: params.talkId,
          authorId: user.userId,
        });
      }
    },
    [user, params]
  );

  const deleteChat = useCallback(async (chatId: number) => {
    await mutateAsyncDeleteChat(chatId);
  }, []);

  const deleteTalk = useCallback(async () => {
    await mutateAsyncDeleteTalk(params.talkId);
  }, []);

  const imagePreviewNavigationHandler = useCallback(
    (imageUrl: string, chatId?: number) => {
      if (talk?.to.name) {
        navigation.navigate("ImagePreview", {
          title: talk.to.name,
          imageUrl,
          chatId,
          talkId: params.talkId,
        });
      }
    },
    [talk, params]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <TalkChatTemplate
      title={talk?.to.name}
      user={user}
      chats={chats?.pages[0]}
      hasMore={hasMore}
      onSend={onSend}
      deleteChat={deleteChat}
      deleteTalk={deleteTalk}
      pickChatImageByCamera={pickImageByCamera}
      pickChatImageByLibrary={pickImageByLibrary}
      readMore={fetchNextPage}
      isLoading={isLoadingUser || isLoadingTalk || isLoadingChats}
      isLoadingPickImage={isLoadingPickImage}
      isLoadingPostChat={isLoadingPostChat || isLoadingPostNotification}
      isLoadingDeleteTalk={isLoadingDeleteTalk}
      imagePreviewNavigationHandler={imagePreviewNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default TalkChatScreen;
