import React, { useCallback } from "react";
import ImagePreviewTemplate from "../components/templates/ImagePreviewTemplate";
import { CommunityStackParamList, TalkStackParamList } from "../types";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";

const ImagePreviewScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute<
    | RouteProp<TalkStackParamList, "ImagePreview">
    | RouteProp<CommunityStackParamList, "ImagePreview">
  >();

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ImagePreviewTemplate
      title={params.title}
      imageUrl={params.imageUrl}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default ImagePreviewScreen;
