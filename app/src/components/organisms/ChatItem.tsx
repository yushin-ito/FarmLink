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
import { Image } from "expo-image";
import { useWindowDimensions } from "react-native";
import {
  GetCommunityChatsResponse,
  GetTalkChatsResponse,
} from "../../hooks/chat/query";
import { useTranslation } from "react-i18next";

type ChatItemProps = {
  type: "community" | "talk";
  item: GetCommunityChatsResponse[number] | GetTalkChatsResponse[number];
  authored: boolean;
  onLongPress: () => void;
  imagePreviewNavigationHandler: (imageUrl: string, chatId?: number) => void;
};

const ChatItem = memo(
  ({
    type,
    item,
    authored,
    onLongPress,
    imagePreviewNavigationHandler,
  }: ChatItemProps) => {
    const { t } = useTranslation("chat");
    const bgColor = useColorModeValue("white", "muted.600");
    const imageColor = useColorModeValue("muted.300", "muted.700");
    const textColor = useColorModeValue("muted.600", "muted.200");
    const ASPECT = 0.7;
    const { width } = useWindowDimensions();

    return (
      <VStack space="1">
        {type === "community" && !authored && (
          <Text ml="-1" fontSize="10" color={textColor}>
            {item.user?.name}
          </Text>
        )}
        <HStack
          mb="2"
          space="2"
          justifyContent={!authored ? "flex-start" : "flex-end"}
        >
          {!authored && (
            <Avatar
              isDisabled
              size="sm"
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
                  mt="2"
                  px="2"
                  py="1"
                  bg={bgColor}
                  shadow="1"
                  rounded="lg"
                  roundedTopLeft={authored ? "xl" : "0"}
                  roundedBottomRight={authored ? "0" : "xl"}
                >
                  <Text bold fontSize="md">
                    {item.message}
                  </Text>
                </Box>
                <Text mx="1" fontSize="10" color={textColor}>
                  {t("time", { date: item.createdAt })}
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
                    mt="8"
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
                    />
                  </Box>
                </Box>
                <Text mx="1" fontSize="10" color={textColor}>
                  {t("time", { date: item.createdAt })}
                </Text>
              </VStack>
            </Pressable>
          )}
        </HStack>
      </VStack>
    );
  }
);

export default ChatItem;
