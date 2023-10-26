import React, { useCallback } from "react";

import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import ImagePreviewTemplate from "../components/templates/ImagePreviewTemplate";
import { showAlert } from "../functions";
import { useDeleteChat } from "../hooks/chat/mutate";
import useMediaLibrary from "../hooks/sdk/useMediaLibrary";
import { RootStackParamList } from "../types";

const ImagePreviewScreen = () => {
  const { t } = useTranslation("app");
  const toast = useToast();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, "ImagePreview">>();

  const { mutateAsync: mutateAsyncDeleteChat } = useDeleteChat({
    onSuccess: async () => {
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
    if (params.chatId) {
      await mutateAsyncDeleteChat(params.chatId);
    }
  }, [params]);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ImagePreviewTemplate
      title={params.title}
      imageUrl={params.imageUrl}
      shareImage={shareImage}
      saveImage={saveImage}
      deleteImage={params.chatId ? deleteImage : undefined}
      isLoading={isLoading}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default ImagePreviewScreen;
