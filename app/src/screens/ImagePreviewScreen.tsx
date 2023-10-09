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

const ImagePreviewScreen = () => {
  const { t } = useTranslation("common");
  const toast = useToast();
  const navigation = useNavigation();
  const { params } = useRoute<
    | RouteProp<MapStackParamList, "ImagePreview">
    | RouteProp<TalkStackParamList, "ImagePreview">
    | RouteProp<CommunityStackParamList, "ImagePreview">
  >();

  const { mutateAsync: mutateAsyncDeleteChat } = useDeleteChat({
    onSuccess: () => {
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
      deleteImage={params.chatId ? deleteImage : undefined}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default ImagePreviewScreen;
