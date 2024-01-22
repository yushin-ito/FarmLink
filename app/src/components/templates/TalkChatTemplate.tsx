import React, { useState } from "react";
import { Alert } from "react-native";

import { Feather } from "@expo/vector-icons";
import {
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  Menu,
  Spinner,
  Text,
  useColorModeValue,
  useDisclose,
} from "native-base";
import { useTranslation } from "react-i18next";

import { GetTalkChatsResponse } from "../../hooks/chat/query";
import { GetUserResponse } from "../../hooks/user/query";
import Overlay from "../molecules/Overlay";
import ChatActionSheet from "../organisms/ChatActionSheet";
import ChatBar from "../organisms/ChatBar";
import ChatItem from "../organisms/ChatItem";

type ChatTemplateProps = {
  title: string | null | undefined;
  user: GetUserResponse | undefined;
  chats: GetTalkChatsResponse | undefined;
  hasMore: boolean | undefined;
  onSend: (message: string) => Promise<void>;
  deleteTalk: () => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
  pickChatImageByCamera: () => Promise<void>;
  pickChatImageByLibrary: () => Promise<void>;
  readMore: () => void;
  isLoading: boolean;
  isLoadingPickImage: boolean;
  isLoadingPostChat: boolean;
  isLoadingDeleteTalk: boolean;
  imagePreviewNavigationHandler: (imageUrl: string, chatId?: number) => void;
  goBackNavigationHandler: () => void;
};

const ChatTemplate = ({
  title,
  user,
  chats,
  hasMore,
  onSend,
  deleteTalk,
  deleteChat,
  pickChatImageByCamera,
  pickChatImageByLibrary,
  readMore,
  isLoading,
  isLoadingPickImage,
  isLoadingPostChat,
  isLoadingDeleteTalk,
  imagePreviewNavigationHandler,
  goBackNavigationHandler,
}: ChatTemplateProps) => {
  const { t } = useTranslation(["chat", "talk"]);

  const bgColor = useColorModeValue("muted.100", "muted.800");
  const headerColor = useColorModeValue("white", "muted.900");
  const menuColor = useColorModeValue("white", "muted.700");
  const pressedColor = useColorModeValue("muted.100", "muted.900");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const [chatId, setChatId] = useState<number | null>(null);

  const {
    isOpen: isChatActionSheetOpen,
    onOpen: onChatActionSheetOpen,
    onClose: onChatActionSheetClose,
  } = useDisclose();

  return (
    <Box flex={1} bg={bgColor}>
      <Overlay isOpen={isLoadingDeleteTalk} />
      <ChatActionSheet
        isOpen={isChatActionSheetOpen}
        onClose={onChatActionSheetClose}
        deleteChat={async () =>
          Alert.alert(t("chat:deleteChat"), t("chat:askDeleteChat"), [
            {
              text: t("chat:cancel"),
              style: "cancel",
            },
            {
              text: t("chat:delete"),
              onPress: () => chatId && deleteChat(chatId),
              style: "destructive",
            },
          ])
        }
      />
      <HStack
        pt="2"
        pb="1"
        px="2"
        alignItems="center"
        justifyContent="space-between"
        bg={headerColor}
        safeAreaTop
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
          <Menu.Item
            pl="1"
            onPress={() =>
              Alert.alert(t("talk:deleteTalk"), t("talk:askDeleteTalk"), [
                {
                  text: t("chat:cancel"),
                  style: "cancel",
                },
                {
                  text: t("chat:delete"),
                  onPress: async () => await deleteTalk(),
                  style: "destructive",
                },
              ])
            }
            _pressed={{ bg: pressedColor }}
          >
            <Text fontSize="md">{t("talk:deleteTalk")}</Text>
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
          mb="2"
          inverted
          data={chats}
          onEndReached={readMore}
          onEndReachedThreshold={0.3}
          automaticallyAdjustKeyboardInsets
          ListFooterComponent={
            <Center mt="5">
              {hasMore && <Spinner color="talk:muted.400" />}
            </Center>
          }
          renderItem={({ item }) => (
            <ChatItem
              type="talk"
              item={item}
              authored={item.authorId === user?.userId}
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
        visible={
          !(isLoadingPickImage || isLoadingDeleteTalk || isChatActionSheetOpen)
        }
        onSend={onSend}
        isLoading={isLoadingPostChat}
        pickImageByCamera={pickChatImageByCamera}
        pickImageByLibrary={pickChatImageByLibrary}
      />
    </Box>
  );
};

export default ChatTemplate;
