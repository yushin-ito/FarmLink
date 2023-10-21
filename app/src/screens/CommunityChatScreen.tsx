import React, { useCallback, useEffect } from "react";

import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import CommunityChatTemplate from "../components/templates/CommunityChatTemplate";
import {
  useDeleteCommunity,
  useUpdateCommunity,
} from "../hooks/community/mutate";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CommunityStackParamList, CommunityStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import {
  useInfiniteQueryCommunities,
  useQueryCommuntiy,
} from "../hooks/community/query";
import useImage from "../hooks/sdk/useImage";
import { useQueryUser } from "../hooks/user/query";
import {
  useDeleteChat,
  usePostChat,
  usePostChatImage,
} from "../hooks/chat/mutate";
import { useInfiniteQueryCommunityChats } from "../hooks/chat/query";
import { supabase } from "../supabase";

const CommunityChatScreen = ({
  navigation,
}: CommunityStackScreenProps<"CommunityChat">) => {
  const { t } = useTranslation("chat");
  const toast = useToast();
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const { params } =
    useRoute<RouteProp<CommunityStackParamList, "CommunityChat">>();
  const { data: community, isLoading: isLoadingCommunity } = useQueryCommuntiy(
    params.communityId
  );
  const { refetch: refetchCommunities } = useInfiniteQueryCommunities(
    params.category,
    session?.user.id
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

  const {
    mutateAsync: mutateAsyncUpdateCommunity,
    isLoading: isLoadingUpdateCommunity,
  } = useUpdateCommunity({
    onSuccess: async (data) => {
      await refetchCommunities();
      if (session && data?.memberIds?.includes(session.user.id)) {
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
    isLoading: isLoadingDeleteCommunity,
  } = useDeleteCommunity({
    onSuccess: async () => {
      await refetchCommunities();
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
    pickImageByCamera: pickChatImageByCamera,
    pickImageByLibrary: pickChatImageByLibrary,
  } = useImage({
    onSuccess: async ({ base64, size }) => {
      if (session && base64) {
        const { path } = await mutateAsyncPostChatImage(base64);
        const { data } = supabase.storage.from("image").getPublicUrl(path);
        await mutateAsyncPostChat({
          communityId: params.communityId,
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

  const {
    pickImageByCamera: pickIconImageByCamera,
    pickImageByLibrary: pickIconImageByLibrary,
  } = useImage({
    onSuccess: async ({ base64 }) => {
      if (session && base64) {
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
      if (session) {
        await mutateAsyncPostChat({
          message,
          communityId: params.communityId,
          authorId: session.user.id,
        });
      }
    },
    [session]
  );

  const deleteChat = useCallback(async (chatId: number) => {
    await mutateAsyncDeleteChat(chatId);
  }, []);

  const leaveCommunity = useCallback(async () => {
    if (session && community) {
      await mutateAsyncUpdateCommunity({
        communityId: params.communityId,
        memberIds: community.memberIds?.filter(
          (memberId) => memberId !== session.user.id
        ),
      });
      navigation.goBack();
    }
  }, [session, community, params]);

  const deleteCommunity = useCallback(async () => {
    await mutateAsyncDeleteCommunity(params.communityId);
    navigation.goBack();
  }, [params]);

  const deleteImage = useCallback(async () => {
    await mutateAsyncUpdateCommunity({
      communityId: params.communityId,
      imageUrl: null,
    });
  }, [params]);

  const imagePreviewNavigationHandler = useCallback(
    (imageUrl: string, chatId?: number) => {
      community?.name &&
        navigation.navigate("ImagePreview", {
          title: community.name,
          imageUrl,
          chatId,
        });
    },
    [community, params]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <CommunityChatTemplate
      title={community?.name}
      owned={session?.user.id === community?.ownerId}
      user={user}
      chats={chats}
      leaveCommunity={leaveCommunity}
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
