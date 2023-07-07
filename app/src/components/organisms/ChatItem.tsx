import React, { memo, useState } from "react";
import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { GetCommunityChatsResponse } from "../../hooks/community/query";
import Avatar from "../molecules/Avatar";
import { GetTalkChatsResponse } from "../../hooks/talk/query";
import { getTimeDistance } from "../../functions";
import { Image } from "expo-image";
import { useWindowDimensions } from "react-native";

type ChatItemProps = {
  item: GetCommunityChatsResponse[number] | GetTalkChatsResponse[number];
  authored: boolean;
  locale: string | null;
  onOpen: () => void;
};

const ChatItem = memo(({ item, authored, locale, onOpen }: ChatItemProps) => {
  const ASPECT = 0.7;
  const dimension = useWindowDimensions();
  const [height, setHeight] = useState(dimension.height);

  return (
    <HStack
      w="100%"
      my="2"
      space="2"
      justifyContent={!authored ? "flex-start" : "flex-end"}
    >
      {!authored && (
        <Avatar
          size="sm"
          text={item.user?.displayName?.charAt(0)}
          avatarUrl={item.user?.avatarUrl}
          updatedAt={item.user?.updatedAt}
          hue={item.user?.hue}
        />
      )}
      {item?.message && (
        <Pressable onLongPress={() => onOpen()} maxW="70%">
          <VStack space="1" alignItems={!authored ? "flex-end" : "flex-start"}>
            <Box
              px="2"
              py="1"
              bg="white"
              shadow="1"
              roundedTop="lg"
              roundedBottomRight={!authored ? "lg" : "0"}
              roundedBottomLeft={!authored ? "0" : "lg"}
            >
              <Text bold fontSize="md">
                {item.message}
              </Text>
            </Box>
            <Text mx="1" fontSize="10" color="muted.600">
              {getTimeDistance(item.createdAt, locale)}
            </Text>
          </VStack>
        </Pressable>
      )}
      {item?.imageUrl && (
        <Pressable onLongPress={() => onOpen()}>
          <VStack space="1" alignItems={!authored ? "flex-end" : "flex-start"}>
            <Box alignItems={!authored ? "flex-start" : "flex-end"}>
              <Box w={dimension.width * ASPECT} h={height} rounded="4">
                <Image
                  style={{
                    flex: 1,

                    borderRadius: 16,
                  }}
                  source={{ uri: item?.imageUrl }}
                  onLoad={(event) => {
                    const newHeight =
                      (dimension.width * ASPECT * event.source.height) /
                      event.source.width;
                    setHeight(newHeight);
                  }}
                  cachePolicy="memory-disk"
                />
              </Box>
            </Box>
            <Text mx="1" fontSize="10" color="muted.600">
              {getTimeDistance(item.createdAt, locale)}
            </Text>
          </VStack>
        </Pressable>
      )}
    </HStack>
  );
});

export default ChatItem;
