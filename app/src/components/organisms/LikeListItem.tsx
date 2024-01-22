import React, { memo } from "react";

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

import { GetUserLikesResponse } from "../../hooks/like/query";

type LikeListItemProps = {
  type: "rental" | "farm";
  item: GetUserLikesResponse[number];
  onPress: () => void;
  onPressRight: () => void;
};

const LikeListItem = memo(
  ({ type, item, onPressRight, onPress }: LikeListItemProps) => {
    const { t } = useTranslation("setting");

    const bgColor = useColorModeValue("white", "#171717");
    const pressedColor = useColorModeValue("#f5f5f5", "#262626");
    const imageColor = useColorModeValue("muted.200", "muted.600");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.500", "muted.300");

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
          style={{
            backgroundColor: bgColor,
          }}
          underlayColor={pressedColor}
          disabled={item.rental?.privated || item.farm?.privated}
        >
          <VStack
            alignItems="center"
            opacity={item.rental?.privated || item.farm?.privated ? 0.6 : 1}
          >
            <HStack
              w="100%"
              px="6"
              py="5"
              alignItems="center"
              justifyContent="space-between"
            >
              {type === "rental" ? (
                <HStack alignItems="center" space="3">
                  <Center
                    size="12"
                    p="1"
                    rounded="md"
                    bg={imageColor}
                    overflow="hidden"
                  >
                    {item.rental.imageUrls?.length ? (
                      <Image
                        style={{ width: 48, height: 48 }}
                        source={{ uri: item.rental.imageUrls[0] }}
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
                  <VStack
                    w={
                      item.rental?.privated || item.farm?.privated
                        ? "70%"
                        : "80%"
                    }
                    space="1"
                  >
                    <Text bold fontSize="md">
                      {item.rental.name}
                    </Text>
                    <Text
                      color={textColor}
                      fontSize="xs"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.rental.description}
                    </Text>
                  </VStack>
                </HStack>
              ) : (
                <HStack alignItems="center" space="3">
                  <Center
                    size="12"
                    rounded="md"
                    bg={imageColor}
                    overflow="hidden"
                  >
                    {item.farm.imageUrls?.length ? (
                      <Image
                        style={{ width: 48, height: 48 }}
                        source={{
                          uri:
                            item.farm.imageUrls[0] + "?=" + item.farm.updatedAt,
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
                  <VStack
                    w={
                      item.rental?.privated || item.farm?.privated
                        ? "70%"
                        : "80%"
                    }
                    space="1"
                  >
                    <Text bold fontSize="md">
                      {item.farm.name}
                    </Text>
                    <Text
                      color={textColor}
                      fontSize="xs"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.farm.description ?? t("noDescription")}
                    </Text>
                  </VStack>
                </HStack>
              )}
              {item.rental?.privated || item.farm?.privated ? (
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

export default LikeListItem;
