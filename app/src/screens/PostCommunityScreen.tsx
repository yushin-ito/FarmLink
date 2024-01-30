import React, { useCallback } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostCommunityTemplate from "../components/templates/PostCommunityTemplate";
import { showAlert } from "../functions";
import { usePostCommunity } from "../hooks/community/mutate";
import { useQueryUser } from "../hooks/user/query";
import { Category, CommunityStackScreenProps } from "../types";

const PostCommunityScreen = ({
  navigation,
}: CommunityStackScreenProps<"PostCommunity">) => {
  const { t } = useTranslation("community");
  const toast = useToast();

  const { data: user } = useQueryUser();

  const {
    mutateAsync: mutateAsyncPostCommunity,
    isPending: isLoadingPostCommunity,
  } = usePostCommunity({
    onSuccess: async () => {
      navigation.goBack();
      showAlert(
        toast,
        <Alert
          status="success"
          onPressCloseButton={() => toast.closeAll()}
          text={t("created")}
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

  const postCommunity = useCallback(
    async (name: string, description: string, category: Category) => {
      if (user) {
        await mutateAsyncPostCommunity({
          name,
          description,
          category,
          ownerId: user.userId,
          color: `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`,
        });
      }
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostCommunityTemplate
      isLoadingPostCommunity={isLoadingPostCommunity}
      postCommunity={postCommunity}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostCommunityScreen;
