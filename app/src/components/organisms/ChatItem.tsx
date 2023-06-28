import React, { memo } from "react";
import { Box, HStack, Text } from "native-base";
import { GetCommunityChatsResponse } from "../../hooks/community/query";
import AutoHeightImage from "../molecules/AutoHeightImage";
import Avatar from "../molecules/Avatar";
import { GetDMChatsResponse } from "../../hooks/dm/query";

type ChatItemProps = {
  item: GetCommunityChatsResponse[number] | GetDMChatsResponse[number];
  isAuthor: boolean;
};

const ChatItem = memo(({ item, isAuthor }: ChatItemProps) => {
  return (
    <HStack
      w="100%"
      space="2"
      justifyContent={isAuthor ? "flex-start" : "flex-end"}
      mb="5"
    >
      {isAuthor && (
        <Avatar
          size="sm"
          user={Array.isArray(item.user) ? item.user[0] : item.user}
        />
      )}
      {item?.message && (
        <Box
          maxW="50%"
          px="2"
          py="1"
          bg="white"
          shadow="1"
          roundedTop="lg"
          roundedBottomRight={isAuthor ? "lg" : "0"}
          roundedBottomLeft={isAuthor ? "0" : "lg"}
        >
          <Text bold fontSize="md">
            {item.message}
          </Text>
        </Box>
      )}
      {item?.imageUrl && (
        <AutoHeightImage ratio={0.5} source={{ uri: item.imageUrl }} />
      )}
    </HStack>
  );
});

export default ChatItem;
