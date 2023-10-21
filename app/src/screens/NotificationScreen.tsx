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
  useUpdateNotification,
} from "../hooks/notification/mutate";

const NotificationScreen = ({
  navigation,
}: SettingStackScreenProps<"Notification">) => {
  const { t } = useTranslation("setting");
  const toast = useToast();
  const { session } = useAuth();
  const {
    data: notifications,
    refetch,
    isLoading: isLoadingNotifications,
  } = useQueryNotifications(session?.user.id);
  const [isRefetchingNotifications, setIsRefetchingNotifications] =
    useState(false);

  const { mutateAsync: mutateAsyncUpdateNotification } = useUpdateNotification({
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

  const {
    mutateAsync: mutateAsyncDeleteNotification,
    isLoading: isLoadingDeleteNotification,
  } = useDeleteNotification({
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
      regionId: number,
      latitude: number,
      longitude: number,
      type: "rental" | "farm"
    ) => {
      navigation.goBack();
      navigation.navigate("TabNavigator", {
        screen: "MapNavigator",
        params: {
          screen: "Map",
          params: { regionId, latitude, longitude, type },
        },
      });
      await mutateAsyncUpdateNotification({ notificationId, clicked: true });
    },
    []
  );

  const talkChatNavigationHandler = useCallback(
    async (notificationId: number, talkId: number) => {
      navigation.goBack();
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
          },
        },
      });
      await mutateAsyncUpdateNotification({ notificationId, clicked: true });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <NotificationTemplate
      notifications={notifications}
      refetchNotifications={refetchNotifications}
      isRefetchingNotifications={isRefetchingNotifications}
      isLoading={isLoadingNotifications || isLoadingDeleteNotification}
      deleteNotification={deleteNotification}
      mapNavigationHandler={mapNavigationHandler}
      talkChatNavigationHandler={talkChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default NotificationScreen;
