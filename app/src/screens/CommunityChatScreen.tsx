import React, { useCallback } from "react";

import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import ChatTemplate from "../components/templates/ChatTemplate";
import {
  usePostCommunityChat,
  usePostCommunityChatImage,
} from "../hooks/community/mutate";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CommunityStackParamList } from "../types";
import useCommunityChat from "../hooks/community/useCommunityChat";
import useAuth from "../hooks/auth/useAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useInfiniteQueryCommunityChats } from "../hooks/community/query";
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
  const { t } = useTranslation("community");
  const toast = useToast();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { params } = useRoute<CommunityChatRouteProp>();
  const navigation = useNavigation<CommunityChatNavigationProp>();
  const {
    data: chats,
    isLoading: isLoadingChats,
    hasNextPage: hasMore,
    fetchNextPage,
    refetch,
  } = useInfiniteQueryCommunityChats(params.communityId);

  useCommunityChat(params.communityId, async () => {
    await refetch();
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

  const { mutateAsync: mutateAsyncPostImage } = usePostCommunityChatImage({
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
    onSuccess: async ({ base64, type }) => {
      if (session?.user && base64 && type) {
        await mutateAsyncPostImage({
          base64,
          type,
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

  const postChat = useCallback(async (message: string) => {
    await mutateAsyncPostChat({
      message,
      communityId: params.communityId,
      authorId: session?.user.id,
    });
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("SettingNavigator", { screen: "Setting" });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ChatTemplate
      title={params.communityName}
      user={user}
      chats={chats}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      postChat={postChat}
      readMore={fetchNextPage}
      isLoadingChats={isLoadingChats}
      hasMore={hasMore}
      settingNavigationHandler={settingNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default CommunityChatScreen;
