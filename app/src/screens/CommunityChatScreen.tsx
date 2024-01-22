import React, { useCallback, useEffect } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import CommunityChatTemplate from "../components/templates/CommunityChatTemplate";
import { showAlert } from "../functions";
import {
  useDeleteChat,
  usePostChat,
  usePostChatImage,
} from "../hooks/chat/mutate";
import { useInfiniteQueryCommunityChats } from "../hooks/chat/query";
import {
  useDeleteCommunity,
  useUpdateCommunity,
} from "../hooks/community/mutate";
import { useQueryCommuntiy } from "../hooks/community/query";
import useImage from "../hooks/sdk/useImage";
import { useQueryUser } from "../hooks/user/query";
import { supabase } from "../supabase";
import { CommunityStackParamList, CommunityStackScreenProps } from "../types";

const CommunityChatScreen = ({
  navigation,
}: CommunityStackScreenProps<"CommunityChat">) => {
  const { t } = useTranslation("chat");
  const toast = useToast();
  const { params } =
    useRoute<RouteProp<CommunityStackParamList, "CommunityChat">>();

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const { data: community, isLoading: isLoadingCommunity } = useQueryCommuntiy(
    params.communityId
  );
  const {
    data: chats,
    isLoading: isLoadingChats,
    hasNextPage: hasMore,
    fetchNextPage,
    refetch: refetchChats,
  } = useInfiniteQueryCommunityChats(params.communityId);

  useEffect(() => {
    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `communityId=eq.${params.communityId}`,
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

  const {
    mutateAsync: mutateAsyncUpdateCommunity,
    isPending: isLoadingUpdateCommunity,
  } = useUpdateCommunity({
    onSuccess: async (data) => {
      if (user && data?.memberIds?.includes(user.userId)) {
        data.imageUrl
          ? showAlert(
              toast,
              <Alert
                status="success"
                onPressCloseButton={() => toast.closeAll()}
                text={t("changed")}
              />
            )
          : showAlert(
              toast,
              <Alert
                status="success"
                onPressCloseButton={() => toast.closeAll()}
                text={t("deleted")}
              />
            );
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

  const {
    mutateAsync: mutateAsyncDeleteCommunity,
    isPending: isLoadingDeleteCommunity,
  } = useDeleteCommunity({
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

  const { mutateAsync: mutateAsyncPostChat, isPending: isLoadingPostChat } =
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
    pickImageByCamera: pickChatImageByCamera,
    pickImageByLibrary: pickChatImageByLibrary,
  } = useImage({
    onSuccess: async ({ base64, size }) => {
      if (user && base64) {
        const { path } = await mutateAsyncPostChatImage(base64);
        const { data } = supabase.storage.from("image").getPublicUrl(path);
        await mutateAsyncPostChat({
          communityId: params.communityId,
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

  const {
    pickImageByCamera: pickIconImageByCamera,
    pickImageByLibrary: pickIconImageByLibrary,
  } = useImage({
    onSuccess: async ({ base64 }) => {
      if (user && base64) {
        const { path } = await mutateAsyncPostChatImage(base64);
        const { data } = supabase.storage.from("image").getPublicUrl(path);
        await mutateAsyncUpdateCommunity({
          communityId: params.communityId,
          imageUrl: data.publicUrl,
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
      if (user) {
        await mutateAsyncPostChat({
          message,
          communityId: params.communityId,
          authorId: user.userId,
        });
      }
    },
    [user]
  );

  const deleteChat = useCallback(async (chatId: number) => {
    await mutateAsyncDeleteChat(chatId);
  }, []);

  const quitCommunity = useCallback(async () => {
    if (user && community) {
      await mutateAsyncUpdateCommunity({
        communityId: params.communityId,
        memberIds: community.memberIds?.filter(
          (memberId) => memberId !== user.userId
        ),
      });
      navigation.goBack();
    }
  }, [user, community, params]);

  const deleteCommunity = useCallback(async () => {
    await mutateAsyncDeleteCommunity(params.communityId);
  }, [params]);

  const deleteImage = useCallback(async () => {
    await mutateAsyncUpdateCommunity({
      communityId: params.communityId,
      imageUrl: null,
    });
  }, [params]);

  const imagePreviewNavigationHandler = useCallback(
    (imageUrl: string, chatId?: number) => {
      if (community) {
        navigation.navigate("ImagePreview", {
          title: community.name,
          imageUrl,
          chatId,
        });
      }
    },
    [community]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <CommunityChatTemplate
      title={community?.name}
      owned={user?.userId === community?.ownerId}
      user={user}
      chats={chats?.pages[0]}
      quitCommunity={quitCommunity}
      deleteCommunity={deleteCommunity}
      deleteChat={deleteChat}
      deleteImage={deleteImage}
      pickChatImageByCamera={pickChatImageByCamera}
      pickChatImageByLibrary={pickChatImageByLibrary}
      pickIconImageByCamera={pickIconImageByCamera}
      pickIconImageByLibrary={pickIconImageByLibrary}
      onSend={onSend}
      readMore={fetchNextPage}
      isLoading={isLoadingUser || isLoadingCommunity || isLoadingChats}
      isLoadingPickImage={isLoadingPickImage}
      isLoadingPostChat={isLoadingPostChat}
      isLoadingUpdateCommunity={isLoadingUpdateCommunity}
      isLoadingDeleteCommunity={isLoadingDeleteCommunity}
      hasMore={hasMore}
      imagePreviewNavigationHandler={imagePreviewNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default CommunityChatScreen;
