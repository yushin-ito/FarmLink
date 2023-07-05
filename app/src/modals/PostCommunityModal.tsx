import React, { useCallback } from "react";
import PostCommunityTemplate from "../components/templates/PostCommunityTemplate";
import { useNavigation } from "@react-navigation/native";
import { useInfiniteQueryCommunities } from "../hooks/community/query";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostCommunity } from "../hooks/community/mutate";
import { useTranslation } from "react-i18next";

const PostCommunityModal = () => {
  const toast = useToast();
  const { t } = useTranslation("community");
  const navigation = useNavigation();
  const { refetch } = useInfiniteQueryCommunities();

  const { mutateAsync, isLoading } = usePostCommunity({
    onSuccess: async () => {
      await refetch();
      navigation.goBack();
    },
    onError: () => {
      navigation.goBack();
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

  const postCommunity = useCallback(
    async (
      communityName: string,
      description: string,
      category: string
    ) => {
      await mutateAsync({
        communityName,
        description,
        category,
        hue: Math.floor(Math.random() * 360).toString(),
      });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostCommunityTemplate
      isLoading={isLoading}
      postCommunity={postCommunity}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostCommunityModal;
