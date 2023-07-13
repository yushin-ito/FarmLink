import React, { memo } from "react";
import { SearchCommunitiesResponse } from "../../hooks/community/mutate";
import { Divider, HStack, Pressable, Text, Icon } from "native-base";
import { Feather } from "@expo/vector-icons";
import Avatar from "../molecules/Avatar";

type SearchCommunityItemProps = {
  item: SearchCommunitiesResponse[number];
  onPress: () => void;
};

const SearchCommunityItem = memo(
  ({ item, onPress }: SearchCommunityItemProps) => {
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
              size="9"
              text={item.name.charAt(0)}
              uri={item.imageUrl}
              color={item.color}
              updatedAt={item.updatedAt}
            />
            <Text bold fontSize="md">
              {item.name}
            </Text>
          </HStack>
          <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
        </HStack>
        <Divider w="90%" bg="muted.200" />
      </Pressable>
    );
  }
);

export default SearchCommunityItem;
