import React, { memo, useRef } from "react";

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Box,
  Center,
  Divider,
  HStack,
  Pressable,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";

import { GetUserFarmsResponse } from "../../hooks/farm/query";
import { Crop } from "../../types";

type FarmListItemProps = {
  item: GetUserFarmsResponse[number];
  onPress: () => void;
  onPressLeft: () => void;
  onPressRight: () => void;
};

const FarmListItem = memo(
  ({ item, onPress, onPressRight, onPressLeft }: FarmListItemProps) => {
    const { t } = useTranslation(["farm", "crop"]);

    const bgColor = useColorModeValue("white", "#171717");
    const pressedColor = useColorModeValue("#f5f5f5", "#262626");
    const imageColor = useColorModeValue("muted.200", "muted.600");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.500", "muted.300");

    const swipeableRef = useRef<Swipeable>(null);

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => (
          <HStack>
            <Pressable
              onPress={() => {
                onPressLeft();
                swipeableRef.current?.close();
              }}
              _pressed={{
                opacity: 0.5,
              }}
            >
              <Center h="100%" w="24" bg="blue.500">
                <Text color="white" bold fontSize="md">
                  {t("edit")}
                </Text>
              </Center>
            </Pressable>
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
          </HStack>
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
                <Center
                  size="12"
                  rounded="md"
                  bg={imageColor}
                  overflow="hidden"
                >
                  {item.imageUrls?.length ? (
                    <Image
                      style={{ width: 48, height: 48 }}
                      source={{
                        uri: item.imageUrls[0] + "?=" + item.updatedAt,
                      }}
                    />
                  ) : (
                    <Icon
                      as={<Feather />}
                      name="image"
                      size="lg"
                      color={iconColor}
                    />
                  )}
                </Center>
              </Box>
              <VStack w="80%" pr="4" space="2">
                <HStack alignItems="center" space="3">
                  <Text
                    maxW="50%"
                    bold
                    fontSize="md"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                  <Text
                    maxW="50%"
                    color={textColor}
                    fontSize="xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </HStack>
                <HStack space="5">
                  <HStack alignItems="center" space="1">
                    <Icon
                      as={<Feather />}
                      name="check"
                      size="3"
                      color={iconColor}
                    />
                    <Text color={iconColor} fontSize="xs">
                      {t(`crop:${item.crop as Crop}`)}
                    </Text>
                  </HStack>
                  <HStack alignItems="center" space="1">
                    <Icon
                      as={<Feather />}
                      name="clock"
                      size="3"
                      color={iconColor}
                    />
                    <Text color={iconColor} fontSize="xs">
                      {t("time", { date: item.createdAt })}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </HStack>
            <Divider w="80%" alignSelf="center" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default FarmListItem;
