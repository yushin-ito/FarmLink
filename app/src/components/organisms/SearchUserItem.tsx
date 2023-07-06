import React, { memo } from "react";
import { SearchUsersResponse } from "../../hooks/user/mutate";
import { Divider, HStack, Pressable, Text, Icon, Center } from "native-base";
import { Feather } from "@expo/vector-icons";
import Avatar from "../molecules/Avatar";

type SearchUserItemProps = {
  item: SearchUsersResponse[number];
  onPress: () => void;
  selected: boolean;
};

const SearchUserItem = memo(({ item, onPress, selected }: SearchUserItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      my="1"
      alignItems="center"
      rounded="md"
      _pressed={{ bg: "muted.300" }}
    >
      <HStack w="100%" p="2" alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" space="2">
          <Avatar
            text={item?.displayName?.charAt(0)}
            avatarUrl={item?.avatarUrl}
            updatedAt={item?.updatedAt}
            hue={item?.hue}
            size="9"
          />
          <Text bold fontSize="md">
            {item?.displayName}
          </Text>
        </HStack>
        <Center
          size="5"
          rounded="full"
          bg={selected ? "success.500" : "muted.300"}
        >
          {selected && (
            <Icon as={<Feather />} name="check" size="xs" color="white" />
          )}
        </Center>
      </HStack>
      <Divider />
    </Pressable>
  );
})

export default SearchUserItem;
