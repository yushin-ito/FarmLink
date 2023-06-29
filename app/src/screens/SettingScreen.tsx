import React, { useCallback } from "react";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSignOut } from "../hooks/auth/mutate";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import SettingTemplate from "../components/templates/SettingTemplate";
import useImage from "../hooks/sdk/useImage";
import { usePostAvatar } from "../hooks/user/mutate";
import { SettingStackParamList } from "../types";

type SettingNavigationProp = NativeStackNavigationProp<
  SettingStackParamList,
  "Setting"
>;

const RoomListScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const navigation = useNavigation<SettingNavigationProp>();
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
            text={t("anyError")}
          />
        );
      },
    });

  const { pickImageByCamera, pickImageByLibrary } = useImage({
    onSuccess: async ({ base64, type }) => {
      if (session?.user && base64 && type) {
        await mutateAsyncPostAvatar({ base64, type, userId: session.user.id });
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
          text={t("anyError")}
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

  return (
    <SettingTemplate
      user={user}
      isLoadingPostAvatar={isLoadingPostAvatar}
      isLoadingSignOut={isLoadingSignOut}
      signOut={signOut}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      postProfileNavigationHandler={postProfileNavigationHandler}
    />
  );
};

export default RoomListScreen;
