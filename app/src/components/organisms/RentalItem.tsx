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
  onPressRight: () => void;
};

const RentalItem = memo(({ item, onPressRight, onPress }: RentalItemProps) => {
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
          <Center h="100%" px="6" bg="red.500">
            <Text color="white" bold fontSize="md">
              {t("delete")}
            </Text>
          </Center>
        </Pressable>
      )}
    >
      <TouchableHighlight onPress={onPress} underlayColor="#e5e5e5">
        <VStack alignItems="center" bg="white">
          <HStack
            w="100%"
            px="6"
            py="5"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack alignItems="center" space="3">
              <Center size="12" rounded="md" bg="muted.200">
                {item.imageUrls?.length ? (
                  <Image
                    style={{ width: 48, height: 48 }}
                    source={{ uri: item.imageUrls[0] }}
                    contentFit="contain"
                    recyclingKey={item.rentalId.toString()}
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
              <Text bold fontSize="md">
                {item?.name}
              </Text>
            </HStack>
            <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
          </HStack>
          <Divider w="90%" bg="muted.200" />
        </VStack>
      </TouchableHighlight>
    </Swipeable>
  );
});

export default RentalItem;
