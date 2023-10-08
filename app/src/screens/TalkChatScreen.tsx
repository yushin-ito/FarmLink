import React, { useCallback, useEffect } from "react";

import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import ChatTemplate from "../components/templates/ChatTemplate";
import { useDeleteTalk, usePostTalk } from "../hooks/talk/mutate";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TalkStackParamList, TalkStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useQueryTalks } from "../hooks/talk/query";
import useImage from "../hooks/sdk/useImage";
import { useQueryUser } from "../hooks/user/query";
import {
  useDeleteChat,
  usePostChat,
  usePostChatImage,
} from "../hooks/chat/mutate";
import { useInfiniteQueryTalkChats } from "../hooks/chat/query";
import { supabase } from "../supabase";
import useNotification from "../hooks/sdk/useNotification";
import { usePostNotification } from "../hooks/notification/mutate";

const TalkChatScreen = ({ navigation }: TalkStackScreenProps<"TalkChat">) => {
  const { t } = useTranslation("chat");
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
        () => {
          refetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params]);

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

  const {
    mutateAsync: mutateAsyncPostNotification,
    isLoading: isLoadingPostNotification,
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

  const { mutateAsync: mutateAsyncPostChat, isLoading: isLoadingPostChat } =
    usePostChat({
      onSuccess: async ({ chatId, authorId, message, imageUrl }) => {
        if (params.token && user) {
          message &&
            (await sendNotification({
              to: params.token,
              title: user.name,
              body: message,
              data: { screenName: "TalkChat" },
            }));
          imageUrl &&
            (await sendNotification({
              to: params.token,
              title: user.name,
              body: t("sendImage"),
              data: { screenName: "TalkChat" },
            }));
          await mutateAsyncPostNotification({
            recieverId: params.recieverId,
            senderId: authorId,
            chatId,
            clicked: false,
          });
        }
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
    onSuccess: async ({ message, imageUrl }) => {
      message &&
        mutateAsyncPostTalk({
          talkId: params.talkId,
          lastMessage: t("deleteMessage"),
        });
      imageUrl &&
        mutateAsyncPostTalk({
          talkId: params.talkId,
          lastMessage: t("deleteImage"),
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

  const { mutateAsync: mutateAsyncPostChatImage } = usePostChatImage({
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
      if (session && user && base64) {
        const { path } = await mutateAsyncPostChatImage(base64);
        const { data } = supabase.storage.from("image").getPublicUrl(path);
        await mutateAsyncPostTalk({
          talkId: params.talkId,
          lastMessage: t("sendImage"),
        });
        await mutateAsyncPostChat({
          talkId: params.talkId,
          authorId: session.user.id,
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
      if (session) {
        await mutateAsyncPostTalk({
          talkId: params.talkId,
          lastMessage: message,
        });
        await mutateAsyncPostChat({
          message,
          talkId: params.talkId,
          authorId: session.user.id,
        });
      }
    },
    [session, params, user]
  );

  const deleteChat = useCallback(async (chatId: number | null) => {
    await mutateAsyncDeleteChat(chatId);
  }, []);

  const deleteTalk = useCallback(async () => {
    await mutateAsyncDeleteTalk(params.talkId);
  }, []);

  const imagePreviewNavigationHandler = useCallback((imageUrl: string) => {
    navigation.navigate("ImagePreview", { imageUrl });
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
      deleteChat={deleteChat}
      deleteRoom={deleteTalk}
      pickChatImageByCamera={pickImageByCamera}
      pickChatImageByLibrary={pickImageByLibrary}
      readMore={fetchNextPage}
      isLoadingChats={isLoadingChats}
      isLoadingPostChat={isLoadingPostChat || isLoadingPostNotification}
      hasMore={hasMore}
      imagePreviewNavigationHandler={imagePreviewNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default TalkChatScreen;
