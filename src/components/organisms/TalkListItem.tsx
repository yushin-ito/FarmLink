import React, { memo } from "react";

import {
  Box,
  Center,
  Divider,
  HStack,
  Pressable,
  Text,
  VStack,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";

import { GetTalksResponse } from "../../hooks/talk/query";
import Avatar from "../molecules/Avatar";

type TalkListItemProps = {
  item: GetTalksResponse[number];
  onPress: () => void;
  onPressRight: () => void;
};

const TalkListItem = memo(
  ({ item, onPressRight, onPress }: TalkListItemProps) => {
    const { t } = useTranslation("talk");

    const bgColor = useColorModeValue("white", "#171717");
    const pressedColor = useColorModeValue("#f5f5f5", "#262626");
    const textColor = useColorModeValue("muted.600", "muted.300");

    return (
      <Swipeable
        renderRightActions={() => (
          <Pressable
            onPress={onPressRight}
            _pressed={{
              opacity: 0.5,
            }}
          >
            <Center h="100%" px="8" bg="red.500">
              <Text color="white" bold fontSize="md">
                {t("delete")}
              </Text>
            </Center>
          </Pressable>
        )}
      >
        <TouchableHighlight
          onPress={onPress}
          style={{ backgroundColor: bgColor }}
          underlayColor={pressedColor}
        >
          <VStack>
            <HStack px="10" py="4">
              <Box w="20%">
                <Avatar
                  size="md"
                  fontSize="2xl"
                  disabled
                  text={item.to.name?.charAt(0)}
                  uri={item.to.avatarUrl}
                  color={item.to.color}
                  updatedAt={item.to.updatedAt}
                />
              </Box>
              <VStack w="80%" space="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Text bold fontSize="md">
                    {item.to.name}
                  </Text>
                  <Text color={textColor} fontSize="sm">
                    {t("time", { date: item.updatedAt })}
                  </Text>
                </HStack>
                {item.chat?.message && (
                  <Text
                    color={textColor}
                    fontSize="xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.chat.message}
                  </Text>
                )}
                {item.chat?.imageUrl && (
                  <Text
                    color={textColor}
                    fontSize="xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {t("sendImage")}
                  </Text>
                )}
                {!item.chatId && (
                  <Text
                    color={textColor}
                    fontSize="xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.createdAt === item.updatedAt
                      ? t("created")
                      : t("unsent")}
                  </Text>
                )}
              </VStack>
            </HStack>
            <Divider w="80%" alignSelf="center" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default TalkListItem;
