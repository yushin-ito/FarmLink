import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Box,
  Center,
  Divider,
  HStack,
  Pressable,
  Text,
  VStack,
  Icon,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { GetUserFarmsResponse } from "../../hooks/farm/query";
import { Image } from "expo-image";

type TalkItemProps = {
  item: GetUserFarmsResponse[number];
  onPress: () => void;
  onPressRight: () => void;
};

const TalkItem = memo(({ item, onPressRight, onPress }: TalkItemProps) => {
  const { t } = useTranslation("farm");
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
        style={{ backgroundColor: "white" }}
        underlayColor="#f5f5f5"
      >
        <VStack>
          <HStack h="20" px="9" py="3">
            <Box w="20%">
              <Center size="12" rounded="md" bg="muted.200" overflow="hidden">
                {item.device?.imageUrl ? (
                  <Image
                    style={{ width: 48, height: 48 }}
                    source={{
                      uri: item.device.imageUrl + "?=" + item.device.updatedAt,
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
            </Box>
            <HStack w="80%" justifyContent="space-between" pr="4">
              <VStack space="1">
                <Text bold fontSize="md">
                  {item.name}
                </Text>
                <Text
                  color="muted.600"
                  fontSize="xs"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.description}
                </Text>
              </VStack>
              <HStack mt="1" space="6" justifyContent="center">
                <VStack alignItems="center">
               
                  <Text color="muted.400" bold fontSize="xs">
                    {t("temperture")}
                  </Text>
                  <Text color="muted.600" bold fontSize="sm">
                    {item?.device?.temperture
                      ? item.device.temperture + "℃"
                      : t("unknown")}
                  </Text>
                </VStack>
                <VStack alignItems="center">
                 
                  <Text color="muted.400" bold fontSize="xs">
                    {t("humidity")}
                  </Text>
                  <Text color="muted.600" bold fontSize="sm">
                    {item?.device?.humidity
                      ? item.device.humidity + "%"
                      : t("unknown")}
                  </Text>
                </VStack>
                <VStack alignItems="center">
               
                  <Text color="muted.400" bold fontSize="xs">
                    {t("moisture")}
                  </Text>
                  <Text color="muted.600" bold fontSize="sm">
                    {item?.device?.moisture
                      ? item.device.moisture + "℃"
                      : t("unknown")}
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </HStack>
          <Divider w="80%" alignSelf="center" bg="muted.200" />
        </VStack>
      </TouchableHighlight>
    </Swipeable>
  );
});

export default TalkItem;
