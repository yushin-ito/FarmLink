import React from "react";
import { GetTalksResponse } from "../../hooks/talk/query";
import { Divider, HStack, Pressable, Text, Icon } from "native-base";
import { Feather } from "@expo/vector-icons";
import Avatar from "../molecules/Avatar";

type SearchTalkItemProps = {
  item: GetTalksResponse[number];
  talkChatNavigationHandler: (
    talkId: number,
    talkName: string | null | undefined
  ) => void;
};

const SearchTalkItem = ({
  item,
  talkChatNavigationHandler,
}: SearchTalkItemProps) => {
  return (
    <Pressable
      onPress={() =>
        talkChatNavigationHandler(item.talkId, item.from.displayName)
      }
      my="1"
      alignItems="center"
      rounded="md"
      _pressed={{ bg: "muted.300" }}
    >
      <HStack w="100%" p="2" alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" space="2">
          <Avatar
            text={item?.to.displayName?.charAt(0)}
            avatarUrl={item?.to.avatarUrl}
            updatedAt={item?.to.updatedAt}
            hue={item?.to.hue}
            size="9"
          />
          <Text bold fontSize="md">
            {item?.to.displayName}
          </Text>
        </HStack>
        <Icon as={<Feather />} name="chevron-right" size="md" ml="2" />
      </HStack>
      <Divider w="95%" />
    </Pressable>
  );
};

export default SearchTalkItem;
