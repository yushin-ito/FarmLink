import React, { useCallback, useState } from "react";
import NotificationTemplate from "../components/templates/NotificationTemplate";
import { SettingStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { showAlert, wait } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useQueryNotifications } from "../hooks/notification/query";
import {
  useDeleteNotification,
  usePostNotification,
} from "../hooks/notification/mutate";

const NotificationScreen = ({
  navigation,
}: SettingStackScreenProps<"Notification">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { session, locale } = useAuth();
  const {
    data: notifications,
    refetch,
    isLoading: isLoadingNotifications,
  } = useQueryNotifications(session?.user.id);
  const [isRefetchingNotifications, setIsRefetchingNotifications] =
    useState(false);

  const { mutateAsync: mutateAsyncPostNotification } = usePostNotification({
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
      navigation.goBack();
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

  const { mutateAsync: mutateAsyncDeleteNotification } = useDeleteNotification({
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
      navigation.goBack();
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

  const deleteNotification = useCallback(async (notificationId: number) => {
    await mutateAsyncDeleteNotification(notificationId);
  }, []);

  const refetchNotifications = useCallback(async () => {
    setIsRefetchingNotifications(true);
    await refetch();
    setIsRefetchingNotifications(false);
  }, []);

  const mapNavigationHandler = useCallback(
    async (
      notificationId: number,
      id: number,
      latitude: number,
      longitude: number,
      type: "farm" | "rental"
    ) => {
      await mutateAsyncPostNotification({ notificationId, clicked: true });
      navigation.goBack();
      await wait(0.1);
      navigation.navigate("TabNavigator", {
        screen: "MapNavigator",
        params: {
          screen: "Map",
          params: { id, latitude, longitude, type },
        },
      });
    },
    []
  );

  const talkChatNavigationHandler = useCallback(
    async (
      notificationId: number,
      talkId: number,
      recieverId: string,
      token: string | null,
      name: string
    ) => {
      await mutateAsyncPostNotification({ notificationId, clicked: true });
      navigation.navigate("TabNavigator", {
        screen: "TalkNavigator",
        params: {
          screen: "TalkList",
        },
      });
      await wait(0.1);
      navigation.navigate("TabNavigator", {
        screen: "TalkNavigator",
        params: {
          screen: "TalkChat",
          params: {
            talkId,
            recieverId,
            token,
            name,
          },
        },
      });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <NotificationTemplate
      locale={locale}
      notifications={notifications}
      refetchNotifications={refetchNotifications}
      isRefetchingNotifications={isRefetchingNotifications}
      isLoadingNotifications={isLoadingNotifications}
      deleteNotification={deleteNotification}
      mapNavigationHandler={mapNavigationHandler}
      talkChatNavigationHandler={talkChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default NotificationScreen;
