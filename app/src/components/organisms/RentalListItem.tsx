import React, { memo, useRef } from "react";

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  Center,
  VStack,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";

import { GetRentalsResponse } from "../../hooks/rental/query";

type RentalListItemProps = {
  item: GetRentalsResponse[number];
  onPress: () => void;
  onPressLeft: () => void;
  onPressRight: () => void;
};

const RentalListItem = memo(
  ({ item, onPress, onPressLeft, onPressRight }: RentalListItemProps) => {
    const { t } = useTranslation("setting");

    const bgColor = useColorModeValue("white", "#171717");
    const pressedColor = useColorModeValue("#f5f5f5", "#262626");
    const imageColor = useColorModeValue("muted.200", "muted.600");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.600", "muted.100");

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
                  {item.privated ? t("public") : t("private")}
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
          <VStack alignItems="center">
            <HStack
              w="100%"
              px="6"
              py="5"
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack alignItems="center" space="3">
                <Center
                  size="12"
                  rounded="md"
                  bg={imageColor}
                  overflow="hidden"
                >
                  {item.imageUrls?.length ? (
                    <Image
                      style={{ width: 48, height: 48 }}
                      source={{ uri: item.imageUrls[0] }}
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
                <VStack w={item.privated ? "70%" : "80%"} space="1">
                  <Text bold fontSize="md">
                    {item.name}
                  </Text>
                  <Text
                    color={textColor}
                    fontSize="xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </VStack>
              </HStack>
              {item.privated ? (
                <Text bold>{t("private")}</Text>
              ) : (
                <Icon
                  as={<Feather />}
                  name="chevron-right"
                  size="md"
                  color={iconColor}
                />
              )}
            </HStack>
            <Divider w="90%" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default RentalListItem;
