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

const SearchUserItem = memo(
  ({ item, onPress, selected }: SearchUserItemProps) => {
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
            <Avatar
              text={item.name.charAt(0)}
              uri={item.avatarUrl}
              color={item.color}
              size="9"
            />
            <Text bold fontSize="md">
              {item?.name}
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
        <Divider w="90%" bg="muted.200" />
      </Pressable>
    );
  }
);

export default SearchUserItem;
