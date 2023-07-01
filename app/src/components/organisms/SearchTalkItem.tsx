import React from "react";
import { SearchTalksResponse } from "../../hooks/talk/mutate";
import { Divider, HStack, Pressable, Text, Icon, Box } from "native-base";
import { Feather } from "@expo/vector-icons";

type SearchTalkItemProps = {
  item: SearchTalksResponse[number];
  talkChatNavigationHandler: (
    talkId: number,
    talkName: string | null | undefined
  ) => void;
};

const SearchtalkItem = ({
  item,
  talkChatNavigationHandler,
}: SearchTalkItemProps) => {
  return (
    <Box>
      <Pressable
        onPress={() =>
          talkChatNavigationHandler(item.talkId, item.user?.displayName)
        }
        my="1"
        alignItems="center"
        rounded="md"
        _pressed={{ bg: "muted.300" }}
      >
        <HStack w="100%" px="1" py="3" justifyContent="space-between">
          <Text>{item?.user?.displayName}</Text>
          <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
        </HStack>
      </Pressable>
      <Divider />
    </Box>
  );
};

export default SearchtalkItem;
