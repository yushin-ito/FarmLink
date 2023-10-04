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
import { GetRentalsResponse } from "../../hooks/rental/query";
import { Image } from "expo-image";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

type RentalItemProps = {
  item: GetRentalsResponse[number];
  onPress: () => void;
  onPressLeft: () => void;
  onPressRight: () => void;
};

const RentalItem = memo(({ item, onPress, onPressLeft, onPressRight }: RentalItemProps) => {
  const { t } = useTranslation("setting");
  return (
    <Swipeable
      renderRightActions={() => (
        <HStack>
          <Pressable
            onPress={onPressLeft}
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
            <HStack alignItems="center" space="3">
              <Center size="12" rounded="md" bg="muted.200" overflow="hidden">
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
                    color="muted.600"
                  />
                )}
              </Center>
              <VStack w="80%" space="1">
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
            </HStack>
            <Icon as={<Feather />} name="chevron-right" size="md" />
          </HStack>
          <Divider w="90%" bg="muted.200" />
        </VStack>
      </TouchableHighlight>
    </Swipeable>
  );
});

export default RentalItem;
