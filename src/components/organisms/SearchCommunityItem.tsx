import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  VStack,
  useColorModeValue,
} from "native-base";

import { SearchCommunitiesResponse } from "../../hooks/community/mutate";
import Avatar from "../molecules/Avatar";

type SearchCommunityItemProps = {
  item: SearchCommunitiesResponse[number];
  onPress: () => void;
};

const SearchCommunityItem = memo(
  ({ item, onPress }: SearchCommunityItemProps) => {
    const pressedColor = useColorModeValue("muted.100", "muted.800");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.600", "muted.100");

    return (
      <Pressable
        onPress={onPress}
        alignItems="center"
        _pressed={{ bg: pressedColor }}
      >
        <HStack
          w="100%"
          px="6"
          py="4"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center" space="3">
            <Avatar
              size="9"
              text={item.name?.charAt(0)}
              uri={item.imageUrl}
              color={item.color}
              updatedAt={item.updatedAt}
            />
            <VStack w="80%" space="1">
              <Text bold fontSize="md">
                {item.name}
              </Text>
              <Text
                color={textColor}
                fontSize="xs"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </VStack>
          </HStack>
          <Icon
            as={<Feather />}
            name="chevron-right"
            size="4"
            ml="2"
            color={iconColor}
          />
        </HStack>
        <Divider w="90%" bg="muted.200" />
      </Pressable>
    );
  }
);

export default SearchCommunityItem;
