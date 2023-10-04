import {
  Box,
  HStack,
  Heading,
  Icon,
  FlatList,
  Text,
  IconButton,
} from "native-base";
import React, { useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import SkeletonNotificationList from "../organisms/SkeletonNotificationList";
import NotificationItem from "../organisms/NotificationItem";
import { GetNotificationsResponse } from "../../hooks/notification/query";

type NotificationTemplateProps = {
  notifications: GetNotificationsResponse | undefined;
  deleteNotification: (notificationId: number) => Promise<void>;
  refetchNotifications: () => Promise<void>;
  isRefetchingNotifications: boolean;
  isLoadingNotifications: boolean;
  mapNavigationHandler: (
    notificationId: number,
    id: number,
    latitude: number,
    longitude: number,
    type: "farm" | "rental"
  ) => void;
  talkChatNavigationHandler: (
    notificationId: number,
    talkId: number,
    recieverId: string,
    token: string | null,
    name: string
  ) => void;
  goBackNavigationHandler: () => void;
};

const NotificationTemplate = ({
  notifications,
  deleteNotification,
  refetchNotifications,
  isRefetchingNotifications,
  isLoadingNotifications,
  mapNavigationHandler,
  talkChatNavigationHandler,
  goBackNavigationHandler,
}: NotificationTemplateProps) => {
  const { t } = useTranslation("setting");

  const getNotificationType = useCallback(
    (notification: GetNotificationsResponse[number]) => {
      if (notification.farmId && notification.farm) {
        return "farm";
      } else if (notification.rentalId && notification.rental) {
        return "rental";
      } else if (notification.chatId && notification.chat) {
        return "chat";
      }
      return "unknown";
    },
    []
  );

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
          variant="unstyled"
        />
        <Heading textAlign="center">{t("notification")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" />}
          variant="unstyled"
        />
      </HStack>
      <Box flex={1}>
        {isLoadingNotifications ? (
          <SkeletonNotificationList rows={4} />
        ) : (
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <NotificationItem
                type={getNotificationType(item)}
                item={item}
                onPress={() => {
                  if (getNotificationType(item) === "farm") {
                    item.farmId &&
                      item.farm.latitude &&
                      item.farm.longitude &&
                      mapNavigationHandler(
                        item.notificationId,
                        item.farmId,
                        item.farm.latitude,
                        item.farm.longitude,
                        "farm"
                      );
                  } else if (getNotificationType(item) === "rental") {
                    item.rentalId &&
                      item.rental.latitude &&
                      item.rental.longitude &&
                      mapNavigationHandler(
                        item.notificationId,
                        item.rentalId,
                        item.rental.latitude,
                        item.rental.longitude,
                        "rental"
                      );
                  } else if (getNotificationType(item) === "chat") {
                    item.chat.talkId &&
                      talkChatNavigationHandler(
                        item.notificationId,
                        item.chat.talkId,
                        item.from.userId,
                        item.from.token,
                        item.from.name
                      );
                  }
                }}
                onPressRight={() => deleteNotification(item.notificationId)}
              />
            )}
            ListEmptyComponent={
              <Text
                bold
                lineHeight="2xl"
                fontSize="md"
                textAlign="center"
                color="muted.600"
              >
                {t("notExistNotification")}
              </Text>
            }
            refreshing={isRefetchingNotifications}
            onRefresh={refetchNotifications}
            keyExtractor={(item) => item.notificationId.toString()}
          />
        )}
      </Box>
    </Box>
  );
};

export default NotificationTemplate;
