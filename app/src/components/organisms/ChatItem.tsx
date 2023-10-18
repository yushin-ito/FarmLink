import React, { memo } from "react";
import {
  Box,
  HStack,
  Pressable,
  Text,
  VStack,
  useColorModeValue,
} from "native-base";
import Avatar from "../molecules/Avatar";
import { getTimeDistance } from "../../functions";
import { Image } from "expo-image";
import { useWindowDimensions } from "react-native";
import {
  GetCommunityChatsResponse,
  GetTalkChatsResponse,
} from "../../hooks/chat/query";
import { Locale } from "../../types";

type ChatItemProps = {
  item: GetCommunityChatsResponse[number] | GetTalkChatsResponse[number];
  authored: boolean;
  locale: Locale | null;
  onLongPress: () => void;
  imagePreviewNavigationHandler: (imageUrl: string, chatId?: number) => void;
};

const ChatItem = memo(
  ({
    item,
    authored,
    locale,
    onLongPress,
    imagePreviewNavigationHandler,
  }: ChatItemProps) => {
    const bgColor = useColorModeValue("white", "muted.600");
    const imageColor = useColorModeValue("muted.300", "muted.700");
    const textColor = useColorModeValue("muted.600", "muted.200");
    const ASPECT = 0.7;
    const { width } = useWindowDimensions();

    return (
      <HStack
        w="100%"
        my="2"
        space="2"
        alignItems="flex-end"
        justifyContent={!authored ? "flex-start" : "flex-end"}
      >
        {!authored && (
          <Avatar
            isDisabled
            size="sm"
            mb="3"
            text={item.user?.name?.charAt(0)}
            uri={item.user?.avatarUrl}
            color={item.user?.color}
            updatedAt={item.user?.updatedAt}
          />
        )}
        {item?.message && (
          <Pressable onLongPress={() => authored && onLongPress()} maxW="70%">
            <VStack
              space="1"
              alignItems={!authored ? "flex-end" : "flex-start"}
            >
              <Box
                px="2"
                py="1"
                bg={bgColor}
                shadow="1"
                roundedTop="xl"
                roundedBottomRight={!authored ? "xl" : "0"}
                roundedBottomLeft={!authored ? "0" : "xl"}
              >
                <Text bold fontSize="md">
                  {item.message}
                </Text>
              </Box>
              <Text mx="1" fontSize="10" color={textColor}>
                {getTimeDistance(item.createdAt, locale)}
              </Text>
            </VStack>
          </Pressable>
        )}
        {item.imageUrl && item.width && item.height && (
          <Pressable
            onPress={() =>
              item.imageUrl &&
              imagePreviewNavigationHandler(
                item.imageUrl,
                authored ? item.chatId : undefined
              )
            }
            onLongPress={() => authored && onLongPress()}
          >
            <VStack
              space="1"
              alignItems={!authored ? "flex-end" : "flex-start"}
            >
              <Box alignItems={!authored ? "flex-start" : "flex-end"}>
                <Box
                  w={width * ASPECT}
                  h={(width * ASPECT * item.height) / item.width}
                  rounded="16"
                  bg={imageColor}
                >
                  <Image
                    style={{
                      flex: 1,
                      borderRadius: 16,
                    }}
                    source={{ uri: item?.imageUrl }}
                    cachePolicy="memory-disk"
                  />
                </Box>
              </Box>
              <Text mx="1" fontSize="10" color={textColor}>
                {getTimeDistance(item.createdAt, locale)}
              </Text>
            </VStack>
          </Pressable>
        )}
      </HStack>
    );
  }
);

export default ChatItem;
