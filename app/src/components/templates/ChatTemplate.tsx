import {
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  IconButton,
  KeyboardAvoidingView,
  Spinner,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform } from "react-native";
import ChatItem from "../organisms/ChatItem";
import ChatBar from "../organisms/ChatBar";
import { GetCommunityChatsResponse } from "../../hooks/community/query";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import { GetDMChatsResponse } from "../../hooks/dm/query";

type ChatTemplateProps = {
  title: string | null;
  user: GetUserResponse | null | undefined;
  chats: GetCommunityChatsResponse | GetDMChatsResponse | undefined;
  isLoadingChats: boolean;
  hasMore: boolean | undefined;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  postChat: (message: string) => Promise<void>;
  readMore: () => void;
  goBackNavigationHandler: () => void;
  settingNavigationHandler: () => void;
};

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
          <HStack alignItems="center">
            <IconButton
              onPress={goBackNavigationHandler}
              icon={<Icon as={<Feather />} title="chevron-left" size="6" />}
              variant="unstyled"
              _pressed={{
                opacity: 0.5,
              }}
            />
            <Heading>{title}</Heading>
          </HStack>
          <Avatar user={user} onPress={settingNavigationHandler} />
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
            <ChatItem item={item} isAuthor={item.authorId === user} />
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
