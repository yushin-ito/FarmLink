import React, { memo } from "react";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  Box,
  Center,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { Image } from "expo-image";
import { Swipeable } from "react-native-gesture-handler";
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
            Alert.alert(t("delete"), t("askDeleteRental"), [
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
      <Pressable
        onPress={onPress}
        alignItems="center"
        _pressed={{ bg: "muted.200" }}
      >
        <HStack
          w="100%"
          px="6"
          py="5"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center" space="3">
            <Box bg="muted.200">
              {item?.imageUrls && (
                <Image source={{ uri: item?.imageUrls[0] }} />
              )}
            </Box>
            <Text bold fontSize="md">
              {item?.rentalName}
            </Text>
          </HStack>
          <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
        </HStack>
        <Divider w="90%" bg="muted.200" />
      </Pressable>
    </Swipeable>
  );
});

export default RentalItem;
