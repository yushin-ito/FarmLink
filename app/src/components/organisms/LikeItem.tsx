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
import { Image } from "expo-image";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { GetUserLikesResponse } from "../../hooks/like/query";

type LikeItemProps = {
  type: "farm" | "rental";
  item: GetUserLikesResponse[number];
  onPress: () => void;
  onPressRight: () => void;
};

const LikeItem = memo(
  ({ type, item, onPressRight, onPress }: LikeItemProps) => {
    const { t } = useTranslation("setting");
    return (
      <Swipeable
        enabled={!(item.farm?.privated || item.rental?.privated)}
        renderRightActions={() => (
          <Pressable
            onPress={onPressRight}
            _pressed={{
              opacity: 0.5,
            }}
          >
            <Center h="100%" px="6" bg="red.500">
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
            backgroundColor: "white",
            opacity: item.farm?.privated || item.rental?.privated ? 0.6 : 1,
          }}
          underlayColor="#f5f5f5"
          disabled={item.farm?.privated || item.rental?.privated}
        >
          <VStack alignItems="center">
            <HStack
              w="100%"
              px="6"
              py="5"
              alignItems="center"
              justifyContent="space-between"
            >
              {type === "farm" ? (
                <HStack alignItems="center" space="3">
                  <Center
                    size="12"
                    rounded="md"
                    bg="muted.100"
                    overflow="hidden"
                  >
                    {item.farm.device.imageUrl ? (
                      <Image
                        style={{ width: 48, height: 48 }}
                        source={{
                          uri:
                            item.farm.device.imageUrl +
                            "?=" +
                            item.farm.device.updatedAt,
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
                  <VStack w="80%" space="1">
                    <Text bold fontSize="md">
                      {item.farm.name}
                    </Text>
                    <Text
                      color="muted.600"
                      fontSize="xs"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.farm.description ?? t("noDescription")}
                    </Text>
                  </VStack>
                </HStack>
              ) : (
                <HStack alignItems="center" space="3">
                  <Center
                    size="12"
                    p="1"
                    rounded="md"
                    bg="muted.100"
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
                        color="muted.600"
                      />
                    )}
                  </Center>
                  <VStack w="80%" space="1">
                    <Text bold fontSize="md">
                      {item.rental.name}
                    </Text>
                    <Text
                      color="muted.600"
                      fontSize="xs"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.rental.description}
                    </Text>
                  </VStack>
                </HStack>
              )}
              {item.farm?.privated || item.rental?.privated ? (
                <Text bold>{t("private")}</Text>
              ) : (
                <Icon as={<Feather />} name="chevron-right" size="md" />
              )}
            </HStack>
            <Divider w="90%" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default LikeItem;
