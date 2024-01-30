import React, { useCallback, useMemo, useRef, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import SettingTemplate from "../components/templates/SettingTemplate";
import { showAlert } from "../functions";
import { useSignOut } from "../hooks/auth/mutate";
import { useQueryNotifications } from "../hooks/notification/query";
import useImage from "../hooks/sdk/useImage";
import { usePostAvatar, useUpdateUser } from "../hooks/user/mutate";
import { useQueryUser } from "../hooks/user/query";
import { supabase } from "../supabase";
import { SettingStackScreenProps } from "../types";

const SettingScreen = ({ navigation }: SettingStackScreenProps<"Setting">) => {
  const toast = useToast();
  const { t } = useTranslation("setting");

  const focusRef = useRef(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQueryUser();
  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useQueryNotifications();

  const unread = useMemo(
    () => notifications?.filter((item) => !item.clicked).length ?? 0,
    [notifications]
  );

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetchUser();
      refetchNotifications();
    }, [])
  );

  const { mutateAsync: mutateAsyncSignOut, isPending: isLoadingSignOut } =
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

  const { mutateAsync: mutateAsyncUpdateUser, isPending: isLoadingUpdateUser } =
    useUpdateUser({
      onSuccess: async () => {
        await refetchUser();
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

  const { mutateAsync: mutateAsyncPostAvatar, isPending: isLoadingPostAvatar } =
    usePostAvatar({
      onSuccess: async ({ path }) => {
        const { data } = supabase.storage.from("image").getPublicUrl(path);
        if (user) {
          mutateAsyncUpdateUser({
            userId: user.userId,
            avatarUrl: data.publicUrl,
          });
        }
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
      if (base64) {
        await mutateAsyncPostAvatar(base64);
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

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await refetchUser();
    await refetchNotifications();
    setIsRefetching(false);
  }, []);

  const deleteAvatar = useCallback(async () => {
    if (user) {
      await mutateAsyncUpdateUser({ userId: user.userId, avatarUrl: null });
    }
  }, [user]);

  const signOut = useCallback(async () => {
    await mutateAsyncSignOut();
  }, []);

  const notificationNavigationHandler = useCallback(() => {
    navigation.navigate("Notification");
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

  const likeListNavigationHandler = useCallback(() => {
    navigation.navigate("LikeList");
  }, []);

  const paymentNavigationHandler = useCallback(() => {
    navigation.navigate("Payment");
  }, []);

  const environmentNavigationHandler = useCallback(() => {
    navigation.navigate("Environment");
  }, []);

  const termsListNavigationHandler = useCallback(() => {
    navigation.navigate("TermsList");
  }, []);

  return (
    <SettingTemplate
      user={user}
      unread={unread}
      signOut={signOut}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      deleteAvatar={deleteAvatar}
      refetch={refetch}
      isLoading={isLoadingUser || isLoadingNotifications}
      isRefetching={isRefetching}
      isLoadingAvatar={
        isLoadingUser ||
        isLoadingNotifications ||
        isLoadingUpdateUser ||
        isLoadingPostAvatar
      }
      isLoadingSignOut={isLoadingSignOut}
      notificationNavigationHandler={notificationNavigationHandler}
      postRentalNavigationHandler={postRentalNavigationHandler}
      postProfileNavigationHandler={postProfileNavigationHandler}
      rentalListNavigationHandler={rentalListNavigationHandler}
      likeListNavigationHandler={likeListNavigationHandler}
      paymentNavigationHandler={paymentNavigationHandler}
      environmentNavigationHandler={environmentNavigationHandler}
      termsListNavigationHandler={termsListNavigationHandler}
    />
  );
};

export default SettingScreen;
