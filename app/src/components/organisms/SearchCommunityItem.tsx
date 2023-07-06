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
        my="1"
        alignItems="center"
        rounded="md"
        _pressed={{ bg: "muted.300" }}
      >
        <HStack
          w="100%"
          p="2"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center" space="2">
            <Avatar
              text={item?.communityName?.charAt(0)}
              avatarUrl={item?.imageUrl}
              updatedAt={item?.updatedAt}
              hue={item?.hue}
              size="9"
            />
            <Text bold fontSize="md">
              {item?.communityName}
            </Text>
          </HStack>
          <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
        </HStack>
        <Divider />
      </Pressable>
    );
  }
);

export default SearchCommunityItem;
