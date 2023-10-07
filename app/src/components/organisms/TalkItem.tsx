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
import { GetTalksResponse } from "../../hooks/talk/query";
import { useTranslation } from "react-i18next";
import Avatar from "../molecules/Avatar";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { getTimeDistance } from "../../functions";

type TalkItemProps = {
  item: GetTalksResponse[number];
  locale: "en" | "ja" | null;
  onPress: () => void;
  onPressRight: () => void;
};

const TalkItem = memo(
  ({ item, locale, onPressRight, onPress }: TalkItemProps) => {
    const { t } = useTranslation("talk");
    const bgColor = useColorModeValue("white", "#171717");
    const pressedColor = useColorModeValue("#f5f5f5", "#262626");
    const textColor = useColorModeValue("muted.600", "muted.300")

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
            <HStack h="20" px="9" py="3">
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
                  <Text fontSize="sm">
                    {getTimeDistance(item.updatedAt, locale)}
                  </Text>
                </HStack>
                <Text
                  color={textColor}
                  fontSize="xs"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.lastMessage}
                </Text>
              </VStack>
            </HStack>
            <Divider w="80%" alignSelf="center" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default TalkItem;
