import React, { useCallback } from "react";

import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import ChatTemplate from "../components/templates/ChatTemplate";
import { usePostDMChat, usePostDMImage } from "../hooks/dm/mutate";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { DMStackParamList } from "../types";
import useDMChat from "../hooks/dm/useDMChat";
import useAuth from "../hooks/auth/useAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useInfiniteQueryDMChats } from "../hooks/dm/query";
import useImage from "../hooks/sdk/useImage";
import { useQueryUser } from "../hooks/user/query";

type DMChatRouteProp = RouteProp<DMStackParamList, "DMChat">;
type DMChatNavigationProp = NativeStackNavigationProp<
  DMStackParamList,
  "DMChat"
>;

const DMChatScreen = () => {
  const { t } = useTranslation("dm");
  const toast = useToast();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { params } = useRoute<DMChatRouteProp>();
  const navigation = useNavigation<DMChatNavigationProp>();
  const {
    data: chats,
    isLoading: isLoadingChats,
    hasNextPage: hasMore,
    fetchNextPage,
    refetch,
  } = useInfiniteQueryDMChats(params.dmId);

  useDMChat(params.dmId, async () => {
    await refetch();
  });

  const { mutateAsync: mutateAsyncPostChat } = usePostDMChat({
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

  const { mutateAsync: mutateAsyncPostImage } = usePostDMImage({
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
          base64: base64,
          type: type,
          dmId: params.dmId,
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
      dmId: params.dmId,
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
      title={params.dmName}
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

export default DMChatScreen;
