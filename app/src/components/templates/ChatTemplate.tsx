import {
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  KeyboardAvoidingView,
  Menu,
  Spinner,
  Text,
  useColorModeValue,
  useDisclose,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform } from "react-native";
import ChatItem from "../organisms/ChatItem";
import ChatBar from "../organisms/ChatBar";
import { GetUserResponse } from "../../hooks/user/query";
import ChatActionSheet from "../organisms/ChatActionSheet";
import { useTranslation } from "react-i18next";
import {
  GetCommunityChatsResponse,
  GetTalkChatsResponse,
} from "../../hooks/chat/query";
import ImageActionSheet from "../organisms/ImageActionSheet";

type ChatTemplateProps = {
  type: "community" | "talk";
  locale: "en" | "ja" | null;
  title: string | null | undefined;
  owned?: boolean;
  user: GetUserResponse | null | undefined;
  chats: GetCommunityChatsResponse | GetTalkChatsResponse | undefined;
  isLoading: boolean;
  isLoadingPostChat: boolean;
  hasMore: boolean | undefined;
  onSend: (message: string) => Promise<void>;
  leaveRoom?: () => Promise<void>;
  deleteRoom: () => Promise<void>;
  deleteChat: (chatId: number | null) => Promise<void>;
  deleteImage?: () => Promise<void>;
  pickIconImageByCamera?: () => Promise<void>;
  pickIconImageByLibrary?: () => Promise<void>;
  pickChatImageByCamera: () => Promise<void>;
  pickChatImageByLibrary: () => Promise<void>;
  readMore: () => void;
  imagePreviewNavigationHandler: (imageUrl: string, chatId?: number) => void;
  goBackNavigationHandler: () => void;
};

const ChatTemplate = ({
  type,
  locale,
  title,
  owned,
  user,
  chats,
  isLoading,
  isLoadingPostChat,
  hasMore,
  onSend,
  leaveRoom,
  deleteRoom,
  deleteChat,
  deleteImage,
  pickIconImageByCamera,
  pickIconImageByLibrary,
  pickChatImageByCamera,
  pickChatImageByLibrary,
  readMore,
  imagePreviewNavigationHandler,
  goBackNavigationHandler,
}: ChatTemplateProps) => {
  const { t } = useTranslation(["chat", "community", "talk"]);
  const bgColor = useColorModeValue("muted.100", "muted.800");
  const menuColor = useColorModeValue("white", "muted.700");
  const pressedColor = useColorModeValue("muted.100", "muted.900");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const {
    isOpen: isChatActionSheetOpen,
    onOpen: onChatActionSheetOpen,
    onClose: onChatActionSheetClose,
  } = useDisclose();
  const {
    isOpen: isImageActionSheetOpen,
    onOpen: onImageActionSheetOpen,
    onClose: onImageActionSheetClose,
  } = useDisclose();
  const [chatId, setChatId] = useState<number | null>(null);

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box flex={1} safeAreaTop>
        {deleteImage && pickIconImageByCamera && pickIconImageByLibrary && (
          <ImageActionSheet
            isOpen={isImageActionSheetOpen}
            onClose={onImageActionSheetClose}
            onDelete={deleteImage}
            pickImageByCamera={pickIconImageByCamera}
            pickImageByLibrary={pickIconImageByLibrary}
          />
        )}
        <ChatActionSheet
          isOpen={isChatActionSheetOpen}
          onClose={onChatActionSheetClose}
          deleteChat={async () =>
            Alert.alert(t("chat:deleteChat"), t("chat:askDeleteChat"), [
              {
                text: t("cancel"),
                style: "cancel",
              },
              {
                text: t("chat:delete"),
                onPress: () => deleteChat(chatId),
                style: "destructive",
              },
            ])
          }
        />
        <HStack
          pt="1"
          pb="2"
          px="2"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center">
            <IconButton
              onPress={goBackNavigationHandler}
              icon={
                <Icon
                  as={<Feather name="chevron-left" />}
                  size="2xl"
                  color={iconColor}
                />
              }
              variant="unstyled"
            />
            <Heading fontSize="xl">{title}</Heading>
          </HStack>
          <Menu
            mr="6"
            shadow="3"
            rounded="lg"
            bg={menuColor}
            trigger={(props) => (
              <IconButton
                icon={
                  <Icon
                    as={<Feather />}
                    name="align-justify"
                    size="md"
                    mr="3"
                    color={iconColor}
                  />
                }
                variant="unstyled"
                _pressed={{
                  opacity: 0.5,
                }}
                {...props}
              />
            )}
          >
            {type === "community" && (
              <Menu.Item
                pl="1"
                onPress={onImageActionSheetOpen}
                _pressed={{ bg: pressedColor }}
              >
                <Text fontSize="md">{t("community:changeIcon")}</Text>
              </Menu.Item>
            )}
            <Menu.Item
              pl="1"
              onPress={() =>
                Alert.alert(
                  type === "community"
                    ? owned
                      ? t("community:deleteCommunity")
                      : t("community:leaveCommunity")
                    : t("talk:deleteTalk"),
                  type === "community"
                    ? owned
                      ? t("community:askDeleteCommunity")
                      : t("community:askLeaveCommunity")
                    : t("talk:askDeleteTalk"),
                  [
                    {
                      text: t("community:cancel"),
                      style: "cancel",
                    },
                    {
                      text: owned
                        ? t("community:delete")
                        : t("community:leave"),
                      onPress: async () =>
                        owned
                          ? await deleteRoom()
                          : leaveRoom && (await leaveRoom()),
                      style: "destructive",
                    },
                  ]
                )
              }
              _pressed={{ bg: pressedColor }}
            >
              <Text fontSize="md">
                {type === "community"
                  ? owned
                    ? t("community:deleteCommunity")
                    : t("community:leaveCommunity")
                  : t("talk:deleteTalk")}
              </Text>
            </Menu.Item>
          </Menu>
        </HStack>
        {isLoading ? (
          <Center flex={1} bg={bgColor}>
            <Spinner color="muted.400" />
          </Center>
        ) : (
          <FlatList
            px="5"
            bg={bgColor}
            inverted
            data={chats}
            onEndReached={readMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              <Center>{hasMore && <Spinner color="muted.400" />}</Center>
            }
            renderItem={({ item }) => (
              <ChatItem
                item={item}
                authored={item.authorId === user?.userId}
                locale={locale}
                onLongPress={() => {
                  onChatActionSheetOpen();
                  setChatId(item.chatId);
                }}
                imagePreviewNavigationHandler={imagePreviewNavigationHandler}
              />
            )}
            keyExtractor={(item) => item.chatId.toString()}
          />
        )}
        <ChatBar
          onSend={onSend}
          isLoading={isLoadingPostChat}
          pickImageByCamera={pickChatImageByCamera}
          pickImageByLibrary={pickChatImageByLibrary}
        />
      </Box>
    </KeyboardAvoidingView>
  );
};

export default ChatTemplate;
