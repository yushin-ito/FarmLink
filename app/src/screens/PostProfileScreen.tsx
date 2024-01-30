import React, { useCallback } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostProfileTemplate from "../components/templates/PostProfileTemplate";
import { showAlert } from "../functions";
import { usePostUser } from "../hooks/user/mutate";
import { useQueryUser } from "../hooks/user/query";
import { SettingStackScreenProps } from "../types";

const PostProfileScreen = ({
  navigation,
}: SettingStackScreenProps<"PostProfile">) => {
  const { t } = useTranslation("setting");
  const toast = useToast();
  const { data: user } = useQueryUser();

  const {
    mutateAsync: mutateAsyncPostProfile,
    isPending: isLoadingPostProfile,
  } = usePostUser({
    onSuccess: async () => {
      showAlert(
        toast,
        <Alert
          status="success"
          onPressCloseButton={() => toast.closeAll()}
          text={t("saved")}
        />
      );
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

  const postProfile = useCallback(
    async (name: string, profile: string) => {
      if (user) {
        await mutateAsyncPostProfile({
          userId: user.userId,
          name,
          profile,
        });
      }
    },
    [user]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostProfileTemplate
      user={user}
      isLoadingPostProfile={isLoadingPostProfile}
      postProfile={postProfile}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostProfileScreen;
