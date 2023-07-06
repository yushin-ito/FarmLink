import React, { memo } from "react";
import { SearchFarmsResponse } from "../../hooks/farm/mutate";
import { Divider, HStack, Pressable, Text, Icon, Box } from "native-base";
import { Feather } from "@expo/vector-icons";

type SearchFarmItemProps = {
  item: SearchFarmsResponse[number];
  onPress: () => void;
};

const SearchFarmItem = memo(({ item, onPress }: SearchFarmItemProps) => {
  return (
    <Box>
      <Pressable
        onPress={onPress}
        my="1"
        alignItems="center"
        rounded="md"
        _pressed={{ bg: "muted.300" }}
      >
        <HStack w="100%" px="1" py="3" justifyContent="space-between">
          <Text>{item?.farmName}</Text>
          <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
        </HStack>
      </Pressable>
      <Divider />
    </Box>
  );
})

export default SearchFarmItem;
