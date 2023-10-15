import React, { useCallback } from "react";
import ImagePreviewTemplate from "../components/templates/ImagePreviewTemplate";
import {
  CommunityStackParamList,
  MapStackParamList,
  TalkStackParamList,
} from "../types";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useDeleteChat } from "../hooks/chat/mutate";
import { useTranslation } from "react-i18next";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import Alert from "../components/molecules/Alert";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import useMediaLibrary from "../hooks/sdk/useMediaLibrary";
import { useQueryTalks } from "../hooks/talk/query";
import useAuth from "../hooks/auth/useAuth";
import { useUpdateTalk } from "../hooks/talk/mutate";

const ImagePreviewScreen = () => {
  const { t } = useTranslation("common");
  const toast = useToast();
  const navigation = useNavigation();
  const { params } = useRoute<
    | RouteProp<MapStackParamList, "ImagePreview">
    | RouteProp<TalkStackParamList, "ImagePreview">
    | RouteProp<CommunityStackParamList, "ImagePreview">
  >();
  const { session } = useAuth();
  const { refetch: refetchTalks } = useQueryTalks(session?.user.id);

  const { mutateAsync: mutateAsyncUpdateTalk } = useUpdateTalk({
    onSuccess: async () => {
      await refetchTalks();
    },
    onError: () => {
      navigation.goBack();
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
    onSuccess: async ({ chatId }) => {
      params.talkId &&
        mutateAsyncUpdateTalk({
          talkId: params.talkId,
          chatId,
        });
      navigation.goBack();
    },
    onError: () => {
      navigation.goBack();
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

  const { saveToLibrary, isLoading } = useMediaLibrary({
    onSuccess: () => {
      showAlert(
        toast,
        <Alert
          status="success"
          onPressCloseButton={() => toast.closeAll()}
          text={t("saved")}
        />
      );
    },
    onDisable: () => {
      navigation.goBack();
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestSave")}
        />
      );
    },
    onError: () => {
      navigation.goBack();
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

  const shareImage = useCallback(async () => {
    const downloadPath = `${FileSystem.cacheDirectory}${Math.floor(
      Math.random() * 100000
    )}.png`;
    const { uri: localUri } = await FileSystem.downloadAsync(
      params.imageUrl,
      downloadPath
    );
    if (!(await Sharing.isAvailableAsync())) {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
      return;
    }
    await Sharing.shareAsync(localUri);
    navigation.goBack();
  }, [params]);

  const saveImage = useCallback(async () => {
    const downloadPath = `${FileSystem.cacheDirectory}${Math.floor(
      Math.random() * 100000
    )}.png`;
    const { uri: localUri } = await FileSystem.downloadAsync(
      params.imageUrl,
      downloadPath
    );

    await saveToLibrary(localUri);
    navigation.goBack();
  }, [params]);

  const deleteImage = useCallback(async () => {
    params.chatId && (await mutateAsyncDeleteChat(params.chatId));
  }, [params]);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ImagePreviewTemplate
      title={params.title}
      imageUrl={params.imageUrl}
      isLoading={isLoading}
      shareImage={shareImage}
      saveImage={saveImage}
      deleteImage={params.chatId ? deleteImage : undefined}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default ImagePreviewScreen;
