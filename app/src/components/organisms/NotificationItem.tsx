import React, { memo } from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  Center,
  VStack,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { GetNotificationsResponse } from "../../hooks/notification/query";
import { Image } from "expo-image";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import Avatar from "../molecules/Avatar";

type NotificationItemProps = {
  type: "farm" | "rental" | "chat" | "unknown";
  item: GetNotificationsResponse[number];
  onPress: () => void;
  onPressRight: () => void;
};

const NotificationItem = memo(
  ({ type, item, onPress, onPressRight }: NotificationItemProps) => {
    const { t } = useTranslation("setting");

    return (
      <Swipeable
        renderRightActions={() => (
          <Pressable
            onPress={onPressRight}
            _pressed={{
              opacity: 0.5,
            }}
          >
            <Center h="100%" w="24" bg="red.500">
              <Text color="white" bold fontSize="md">
                {t("delete")}
              </Text>
            </Center>
          </Pressable>
        )}
      >
        <TouchableHighlight
          onPress={onPress}
          style={{ backgroundColor: "white" }}
          underlayColor="#f5f5f5"
        >
          <VStack alignItems="center">
            <HStack
              w="100%"
              px="6"
              py="5"
              alignItems="center"
              justifyContent="space-between"
            >
              {type === "farm" && (
                <HStack alignItems="center" space="3">
                  <Center
                    size="12"
                    rounded="md"
                    bg="muted.200"
                    overflow="hidden"
                  >
                    <Image
                      style={{ width: 48, height: 48 }}
                      source={{
                        uri:
                          item.farm.device.imageUrl +
                          "?=" +
                          item.farm.device.updatedAt,
                      }}
                    />
                  </Center>
                  <Text
                    w="80%"
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    fontSize="15"
                  >
                    {item.farm?.name + t("to") + item.from?.name + t("liked")}
                  </Text>
                </HStack>
              )}
              {type === "rental" && (
                <HStack alignItems="center" space="3">
                  <Center
                    size="12"
                    rounded="md"
                    bg="muted.200"
                    overflow="hidden"
                  >
                    {item.rental.imageUrls?.length ? (
                      <Image
                        style={{ width: 48, height: 48 }}
                        source={{
                          uri: item.rental.imageUrls[0],
                        }}
                      />
                    ) : (
                      <Icon
                        as={<Feather />}
                        name="image"
                        size="lg"
                        color="muted.600"
                      />
                    )}
                  </Center>
                  <Text
                    w="80%"
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    fontSize="15"
                  >
                    {item.rental?.name + t("to") + item.from?.name + t("liked")}
                  </Text>
                </HStack>
              )}
              {type === "chat" && (
                <HStack alignItems="center" space="3">
                  <Avatar
                    size="md"
                    fontSize="2xl"
                    disabled
                    text={item.from?.name.charAt(0)}
                    uri={item.from?.avatarUrl}
                    color={item.from?.color}
                    updatedAt={item.from?.updatedAt}
                  />
                  <Text
                    w="80%"
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    fontSize="15"
                  >
                    {item.from?.name + t("send")}
                  </Text>
                </HStack>
              )}
              <Icon as={<Feather />} name="chevron-right" size="md" />
            </HStack>
            <Divider w="90%" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default NotificationItem;
