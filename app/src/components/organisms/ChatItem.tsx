import React, { memo } from "react";
import { Box, HStack, Text, VStack } from "native-base";
import { GetCommunityChatsResponse } from "../../hooks/community/query";
import AutoHeightImage from "../molecules/AutoHeightImage";
import Avatar from "../molecules/Avatar";
import { GetTalkChatsResponse } from "../../hooks/talk/query";
import { getTimeDistance } from "../../functions";

type ChatItemProps = {
  item: GetCommunityChatsResponse[number] | GetTalkChatsResponse[number];
  isAuthor: boolean;
  locale: string | null;
};

const ChatItem = memo(({ item,isAuthor, locale }: ChatItemProps) => {
  return (
    <HStack
      w="100%"
      my="2"
      space="2"
      justifyContent={!isAuthor ? "flex-start" : "flex-end"}
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
        <VStack
          maxW="70%"
          space="1"
          alignItems={!isAuthor ? "flex-end" : "flex-start"}
        >
          <Box
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
          <Text mx="1" fontSize="10" color="muted.600">
            {getTimeDistance(item.createdAt, locale)}
          </Text>
        </VStack>
      )}
      {item?.imageUrl && (
        <VStack space="1" alignItems={!isAuthor ? "flex-end" : "flex-start"}>
          <Box alignItems={!isAuthor ? "flex-start" : "flex-end"}>
            <AutoHeightImage ratio={0.7} source={{ uri: item.imageUrl }} />
          </Box>
          <Text mx="1" fontSize="10" color="muted.600">
            {getTimeDistance(item.createdAt, locale)}
          </Text>
        </VStack>
      )}
    </HStack>
  );
});

export default ChatItem;
