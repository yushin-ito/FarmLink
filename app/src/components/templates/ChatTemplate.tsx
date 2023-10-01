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

type ChatTemplateProps = {
  type: "community" | "talk";
  locale: "en" | "ja" | null;
  title: string | null | undefined;
  user: GetUserResponse | null | undefined;
  chats: GetCommunityChatsResponse | GetTalkChatsResponse | undefined;
  isLoadingChats: boolean;
  isLoadingPostChat: boolean;
  hasMore: boolean | undefined;
  onSend: (message: string) => Promise<void>;
  deleteRoom: () => Promise<void>;
  deleteChat: (chatId: number | null) => Promise<void>;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  readMore: () => void;
  goBackNavigationHandler: () => void;
};

const ChatTemplate = ({
  type,
  locale,
  title,
  user,
  chats,
  isLoadingChats,
  isLoadingPostChat,
  hasMore,
  onSend,
  deleteRoom,
  deleteChat,
  pickImageByCamera,
  pickImageByLibrary,
  readMore,
  goBackNavigationHandler,
}: ChatTemplateProps) => {
  const { t } = useTranslation(["chat", "community", "talk"]);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [chatId, setChatId] = useState<number | null>(null);

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box flex={1} safeAreaTop>
        <ChatActionSheet
          isOpen={isOpen}
          onClose={onClose}
          deleteChat={() => deleteChat(chatId)}
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
              icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
              variant="unstyled"
            />
            <Heading fontSize="xl">{title}</Heading>
          </HStack>
          <Menu
            mr="6"
            shadow="3"
            rounded="lg"
            bg="white"
            trigger={(props) => (
              <IconButton
                icon={
                  <Icon
                    as={<Feather />}
                    name="align-justify"
                    size="md"
                    mr="3"
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
              onPress={() =>
                Alert.alert(
                  type === "community"
                    ? t("community:deleteCommunity")
                    : t("talk:deleteTalk"),
                  type === "community"
                    ? t("community:askDeleteCommunity")
                    : t("talk:askDeleteTalk"),
                  [
                    {
                      text: t("chat:cancel"),
                      style: "cancel",
                    },
                    {
                      text: t("chat:delete"),
                      onPress: async () => await deleteRoom(),
                      style: "destructive",
                    },
                  ]
                )
              }
              _pressed={{ bg: "muted.200" }}
            >
              <Icon as={<Feather />} name="trash" size="md" />
              <Text>
                {(type === "community"
                  ? t("community:community")
                  : t("talk:talk")) + t("chat:delete")}
              </Text>
            </Menu.Item>
          </Menu>
        </HStack>

        {isLoadingChats ? (
          <Center flex={1} bg="muted.100">
            <Spinner color="muted.400" />
          </Center>
        ) : (
          <FlatList
            w="100%"
            px="5"
            bg="muted.100"
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
                  onOpen();
                  setChatId(item.chatId);
                }}
              />
            )}
            keyExtractor={(item) => item.chatId.toString()}
          />
        )}
        <ChatBar
          onSend={onSend}
          isLoading={isLoadingPostChat}
          pickImageByCamera={pickImageByCamera}
          pickImageByLibrary={pickImageByLibrary}
        />
      </Box>
    </KeyboardAvoidingView>
  );
};

export default ChatTemplate;
