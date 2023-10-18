import {
  Box,
  HStack,
  Heading,
  Icon,
  FlatList,
  Text,
  IconButton,
  useColorModeValue,
} from "native-base";
import React, { useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import SkeletonNotification from "../organisms/SkeletonNotification";
import NotificationItem from "../organisms/NotificationItem";
import { GetNotificationsResponse } from "../../hooks/notification/query";
import { RefreshControl } from "react-native";
import { Locale } from "../../types";

type NotificationTemplateProps = {
  locale: Locale | null;
  notifications: GetNotificationsResponse | undefined;
  deleteNotification: (notificationId: number) => Promise<void>;
  refetchNotifications: () => Promise<void>;
  isLoading: boolean;
  isRefetchingNotifications: boolean;
  mapNavigationHandler: (
    notificationId: number,
    regionId: number,
    latitude: number,
    longitude: number,
    type: "rental" | "farm"
  ) => void;
  talkChatNavigationHandler: (notificationId: number, talkId: number) => void;
  goBackNavigationHandler: () => void;
};

const NotificationTemplate = ({
  locale,
  notifications,
  deleteNotification,
  refetchNotifications,
  isLoading,
  isRefetchingNotifications,
  mapNavigationHandler,
  talkChatNavigationHandler,
  goBackNavigationHandler,
}: NotificationTemplateProps) => {
  const { t } = useTranslation("setting");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const getNotificationType = useCallback(
    (notification: GetNotificationsResponse[number]) => {
      if (notification.farmId) {
        return "farm";
      } else if (notification.rentalId) {
        return "rental";
      } else if (notification.talkId) {
        return "chat";
      } else {
        return "unknown";
      }
    },
    []
  );

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={
            <Icon
              as={<Feather name="chevron-left" />}
              size="2xl"
              color={iconColor}
            />
          }
          variant="unstyled"
        />
        <Heading textAlign="center">{t("notification")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <Box flex={1}>
        {isLoading ? (
          <SkeletonNotification rows={6} />
        ) : (
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <NotificationItem
                type={getNotificationType(item)}
                item={item}
                locale={locale}
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
                    item.talkId &&
                      talkChatNavigationHandler(
                        item.notificationId,
                        item.talkId
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
                color={textColor}
              >
                {t("notExistNotification")}
              </Text>
            }
            refreshing={isRefetchingNotifications}
            onRefresh={refetchNotifications}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingNotifications}
                onRefresh={refetchNotifications}
                tintColor={spinnerColor}
              />
            }
            keyExtractor={(item) => item.notificationId.toString()}
          />
        )}
      </Box>
    </Box>
  );
};

export default NotificationTemplate;
