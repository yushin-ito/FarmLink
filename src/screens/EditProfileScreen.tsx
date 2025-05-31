import React, { useCallback } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import EditProfileTemplate from "../components/templates/EditProfileTemplate";
import { showAlert } from "../functions";
import { useUpdateUser } from "../hooks/user/mutate";
import { useQueryUser } from "../hooks/user/query";
import { SettingStackScreenProps } from "../types";

const EditProfileScreen = ({
  navigation,
}: SettingStackScreenProps<"EditProfile">) => {
  const { t } = useTranslation("setting");
  const toast = useToast();
  const { data: user } = useQueryUser();

  const {
    mutateAsync: mutateAsyncUpdateProfile,
    isPending: isLoadingUpdateProfile,
  } = useUpdateUser({
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

  const updateProfile = useCallback(
    async (name: string, profile: string) => {
      if (user) {
        await mutateAsyncUpdateProfile({
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
    <EditProfileTemplate
      user={user}
      isLoadingUpdateProfile={isLoadingUpdateProfile}
      updateProfile={updateProfile}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditProfileScreen;
