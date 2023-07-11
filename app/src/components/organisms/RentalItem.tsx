import React, { memo } from "react";
import { Divider, HStack, Pressable, Text, Icon, Box } from "native-base";
import { Feather } from "@expo/vector-icons";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { Image } from "expo-image";

type RentalItemProps = {
  item: GetRentalsResponse[number];
  onPress: () => void;
};

const RentalItem = memo(({ item, onPress }: RentalItemProps) => {
  return (
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
            {item?.imageUrls && <Image source={{ uri: item?.imageUrls[0] }} />}
          </Box>
          <Text bold fontSize="md">
            {item?.rentalName}
          </Text>
        </HStack>
        <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
      </HStack>
      <Divider w="90%" bg="muted.200" />
    </Pressable>
  );
});

export default RentalItem;
