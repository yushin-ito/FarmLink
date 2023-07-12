import React, { memo } from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  Box,
  Center,
  VStack,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { Image } from "expo-image";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

type RentalItemProps = {
  item: GetRentalsResponse[number];
  deleteRental: (rentalId: number) => Promise<void>;
  onPress: () => void;
};

const RentalItem = memo(({ item, deleteRental, onPress }: RentalItemProps) => {
  const { t } = useTranslation("setting");
  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable
          onPress={() =>
            Alert.alert(t("deleteRental"), t("askDeleteRental"), [
              {
                text: t("cancel"),
                style: "cancel",
              },
              {
                text: t("delete"),
                onPress: async () => await deleteRental(item.rentalId),
                style: "destructive",
              },
            ])
          }
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
        <VStack alignItems="center">
          <HStack
            w="100%"
            px="6"
            py="5"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack alignItems="center" space="3">
              <Box size="12" rounded="sm" bg="muted.200">
                {item.imageUrls && (
                  <Image
                    style={{ flex: 1 }}
                    source={{ uri: item.imageUrls[0] }}
                    contentFit="contain"
                  />
                )}
              </Box>
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
