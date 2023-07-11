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
import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import ChatItem from "../organisms/ChatItem";
import ChatBar from "../organisms/ChatBar";
import { GetCommunityChatsResponse } from "../../hooks/community/query";
import { GetUserResponse } from "../../hooks/user/query";
import { GetTalkChatsResponse } from "../../hooks/talk/query";
import BackButton from "../molecules/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatActionSheet from "../organisms/ChatActionSheet";
import { useTranslation } from "react-i18next";

type ChatTemplateProps = {
  type: "community" | "talk";
  title: string | null | undefined;
  user: GetUserResponse | null | undefined;
  chats: GetCommunityChatsResponse | GetTalkChatsResponse | undefined;
  isLoadingChats: boolean;
  hasMore: boolean | undefined;
  deleteRoom: () => Promise<void>;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  postChat: (message: string) => Promise<void>;
  readMore: () => void;
  goBackNavigationHandler: () => void;
};

const ChatTemplate = ({
  type,
  title,
  user,
  chats,
  isLoadingChats,
  hasMore,
  deleteRoom,
  pickImageByCamera,
  pickImageByLibrary,
  postChat,
  readMore,
  goBackNavigationHandler,
}: ChatTemplateProps) => {
  const { t } = useTranslation(["chat", "community", "talk"]);
  const [locale, setLocale] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclose();

  useEffect(() => {
    (async () => {
      const locale = await AsyncStorage.getItem("@locale");
      setLocale(locale);
    })();
  }, []);

  if (isLoadingChats) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-45}
    >
      <Box flex={1} pt="5" safeAreaTop>
        <ChatActionSheet isOpen={isOpen} onClose={onClose} />
        <HStack
          pb="2"
          px="4"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center" space="3">
            <BackButton onPress={goBackNavigationHandler} />
            <Heading fontSize="xl">{title}</Heading>
          </HStack>
          <Menu
            mr="4"
            shadow="3"
            rounded="lg"
            bg="white"
            trigger={(props) => (
              <IconButton
                icon={<Icon as={<Feather />} name="align-justify" size="md" />}
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
              onLongPress={onOpen}
            />
          )}
          keyExtractor={(item) => item.chatId.toString()}
        />
        <ChatBar
          postChat={postChat}
          pickImageByCamera={pickImageByCamera}
          pickImageByLibrary={pickImageByLibrary}
        />
      </Box>
    </KeyboardAvoidingView>
  );
};

export default ChatTemplate;
