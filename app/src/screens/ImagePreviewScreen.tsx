import React, { useCallback } from "react";
import ImagePreviewTemplate from "../components/templates/ImagePreviewTemplate";
import { RootStackParamList } from "../types";
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

const ImagePreviewScreen = () => {
  const { t } = useTranslation("app");
  const toast = useToast();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, "ImagePreview">>();
  const { session } = useAuth();
  const { refetch: refetchTalks } = useQueryTalks(session?.user.id);

  const { mutateAsync: mutateAsyncDeleteChat } = useDeleteChat({
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
      isLoading={isLoading}
      shareImage={shareImage}
      saveImage={saveImage}
      deleteImage={params.chatId ? deleteImage : undefined}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default ImagePreviewScreen;
