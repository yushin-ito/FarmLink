import React from "react";
import { SearchDMsResponse } from "../../hooks/dm/mutate";
import { Divider, HStack, Pressable, Text, Icon, Box } from "native-base";
import { Feather } from "@expo/vector-icons";

type SearchDMItemProps = {
  item: SearchDMsResponse[number];
  dmChatNavigationHandler: (dmId: number, dmName: string | null) => void;
};

const SearchDMItem = ({ item, dmChatNavigationHandler }: SearchDMItemProps) => {
  return (
    <Box>
      <Pressable
        onPress={() => dmChatNavigationHandler(item.dmId, item.dmName)}
        my="1"
        alignItems="center"
        rounded="md"
        _pressed={{ bg: "muted.300" }}
      >
        <HStack w="100%" px="1" py="3" justifyContent="space-between">
          <Text>{item?.dmName}</Text>
          <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
        </HStack>
      </Pressable>
      <Divider />
    </Box>
  );
};

export default SearchDMItem;
