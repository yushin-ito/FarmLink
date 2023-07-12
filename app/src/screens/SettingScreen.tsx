import React, { useCallback } from "react";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useSignOut } from "../hooks/auth/mutate";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import SettingTemplate from "../components/templates/SettingTemplate";
import useImage from "../hooks/sdk/useImage";
import { usePostAvatar } from "../hooks/user/mutate";
import { SettingStackScreenProps } from "../types";

const SettingScreen = ({ navigation }: SettingStackScreenProps<"Setting">) => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const { session } = useAuth();
  const { data: user, refetch } = useQueryUser(session?.user.id);

  const { mutateAsync: mutateAsyncSignOut, isLoading: isLoadingSignOut } =
    useSignOut({
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("signoutError")}
          />
        );
      },
    });

  const { mutateAsync: mutateAsyncPostAvatar, isLoading: isLoadingPostAvatar } =
    usePostAvatar({
      onSuccess: async () => {
        await refetch();
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

  const { pickImageByCamera, pickImageByLibrary } = useImage({
    onSuccess: async ({ base64 }) => {
      if (session?.user && base64) {
        await mutateAsyncPostAvatar({ base64, userId: session.user.id });
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
          text={t("error")}
        />
      );
    },
  });

  const signOut = useCallback(async () => {
    await mutateAsyncSignOut();
  }, []);

  const postProfileNavigationHandler = useCallback(() => {
    navigation.navigate("PostProfile");
  }, []);

  const postRentalNavigationHandler = useCallback(() => {
    navigation.navigate("PostRental");
  }, []);

  const rentalListNavigationHandler = useCallback(() => {
    navigation.navigate("RentalList");
  }, []);

  return (
    <SettingTemplate
      user={user}
      isLoadingPostAvatar={isLoadingPostAvatar}
      isLoadingSignOut={isLoadingSignOut}
      signOut={signOut}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      postRentalNavigationHandler={postRentalNavigationHandler}
      postProfileNavigationHandler={postProfileNavigationHandler}
      rentalListNavigationHandler={rentalListNavigationHandler}
    />
  );
};

export default SettingScreen;
