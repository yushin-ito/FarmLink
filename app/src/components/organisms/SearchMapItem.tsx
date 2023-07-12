import React, { memo } from "react";
import { SearchFarmsResponse } from "../../hooks/farm/mutate";
import { Divider, HStack, Pressable, Text, Icon } from "native-base";
import { Feather } from "@expo/vector-icons";
import { SearchRentalsResponse } from "../../hooks/rental/mutate";

type SearchMapItemProps = {
  item: SearchFarmsResponse[number] | SearchRentalsResponse[number];
  onPress: () => void;
};

const SearchMapItem = memo(({ item, onPress }: SearchMapItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      alignItems="center"
      _pressed={{ bg: "muted.200" }}
    >
      <HStack w="100%" px="6" py="5" justifyContent="space-between">
        <Text>{item.name}</Text>
        <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
      </HStack>
      <Divider w="90%" bg="muted.200" />
    </Pressable>
  );
});

export default SearchMapItem;
