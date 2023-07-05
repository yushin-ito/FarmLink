import React, { memo } from "react";
import { Box, HStack, Text } from "native-base";
import { GetCommunityChatsResponse } from "../../hooks/community/query";
import AutoHeightImage from "../molecules/AutoHeightImage";
import Avatar from "../molecules/Avatar";
import { GetTalkChatsResponse } from "../../hooks/talk/query";

type ChatItemProps = {
  item: GetCommunityChatsResponse[number] | GetTalkChatsResponse[number];
  isAuthor: boolean;
};

const ChatItem = memo(({ item, isAuthor }: ChatItemProps) => {
  return (
    <HStack
      w="100%"
      space="2"
      justifyContent={!isAuthor ? "flex-start" : "flex-end"}
      mb="5"
    >
      {!isAuthor && (
        <Avatar
          size="sm"
          text={item.user?.displayName?.charAt(0)}
          avatarUrl={item.user?.avatarUrl}
          updatedAt={item.user?.updatedAt}
          hue={item.user?.hue}
        />
      )}
      {item?.message && (
        <Box
          maxW="70%"
          px="2"
          py="1"
          bg="white"
          shadow="1"
          roundedTop="lg"
          roundedBottomRight={!isAuthor ? "lg" : "0"}
          roundedBottomLeft={!isAuthor ? "0" : "lg"}
        >
          <Text bold fontSize="md">
            {item.message}
          </Text>
        </Box>
      )}
      {item?.imageUrl && (
        <Box w="100%" alignItems={!isAuthor ? "flex-start" : "flex-end"}>
          <AutoHeightImage ratio={0.7} source={{ uri: item.imageUrl }} />
        </Box>
      )}
    </HStack>
  );
});

export default ChatItem;
