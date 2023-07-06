import {
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  KeyboardAvoidingView,
  Spinner,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import ChatItem from "../organisms/ChatItem";
import ChatBar from "../organisms/ChatBar";
import { GetCommunityChatsResponse } from "../../hooks/community/query";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import { GetTalkChatsResponse } from "../../hooks/talk/query";
import BackButton from "../molecules/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ChatTemplateProps = {
  title: string | null | undefined;
  user: GetUserResponse | null | undefined;
  chats: GetCommunityChatsResponse | GetTalkChatsResponse | undefined;
  isLoadingChats: boolean;
  hasMore: boolean | undefined;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  postChat: (message: string) => Promise<void>;
  readMore: () => void;
  goBackNavigationHandler: () => void;
  settingNavigationHandler: () => void;
};

type Locale = "ja" | "en" | null;

const ChatTemplate = ({
  title,
  user,
  chats,
  isLoadingChats,
  hasMore,
  pickImageByCamera,
  pickImageByLibrary,
  postChat,
  readMore,
  goBackNavigationHandler,
  settingNavigationHandler,
}: ChatTemplateProps) => {
  const [locale, setLocale] = useState<Locale>(null);

  useEffect(() => {
    (async () => {
      const locale = await AsyncStorage.getItem("@locale");
      setLocale(locale as Locale);
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
        <HStack
          mb="4"
          pl="3"
          pr="9"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center" space="3">
            <BackButton onPress={goBackNavigationHandler} />
            <Heading fontSize="2xl">{title}</Heading>
          </HStack>
          <Avatar
            text={user?.displayName?.charAt(0)}
            avatarUrl={user?.avatarUrl}
            updatedAt={user?.updatedAt}
            hue={user?.hue}
            onPress={settingNavigationHandler}
          />
        </HStack>
        <FlatList
          w="100%"
          px="5"
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
              isAuthor={item.authorId === user?.userId}
              locale={locale}
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
