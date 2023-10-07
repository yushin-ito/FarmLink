import React, { memo } from "react";
import { GetTalksResponse } from "../../hooks/talk/query";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  VStack,
  useColorModeValue,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import Avatar from "../molecules/Avatar";

type SearchTalkItemProps = {
  item: GetTalksResponse[number];
  onPress: () => void;
};

const SearchTalkItem = memo(({ item, onPress }: SearchTalkItemProps) => {
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
        py="5"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack alignItems="center" space="3">
          <Avatar
            text={item.to.name.charAt(0)}
            uri={item.to.avatarUrl}
            color={item.to.color}
            size="9"
            updatedAt={item.to.updatedAt}
          />
          <VStack w="80%" space="1">
            <Text bold fontSize="md">
              {item.to.name}
            </Text>
            <Text
              color={textColor}
              fontSize="xs"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.lastMessage}
            </Text>
          </VStack>
        </HStack>
        <Icon
          as={<Feather />}
          name="chevron-right"
          size="md"
          color={iconColor}
        />
      </HStack>
      <Divider w="90%" bg="muted.200" />
    </Pressable>
  );
});

export default SearchTalkItem;
