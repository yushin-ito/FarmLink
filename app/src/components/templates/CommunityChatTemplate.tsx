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
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert } from "react-native";
import ChatItem from "../organisms/ChatItem";
import ChatBar from "../organisms/ChatBar";
import { GetUserResponse } from "../../hooks/user/query";
import ChatActionSheet from "../organisms/ChatActionSheet";
import { useTranslation } from "react-i18next";
import { GetCommunityChatsResponse } from "../../hooks/chat/query";
import ImageActionSheet from "../organisms/ImageActionSheet";
import Overlay from "../molecules/Overlay";

type CommunityChatTemplateProps = {
  title: string | null | undefined;
  owned: boolean;
  user: GetUserResponse | null | undefined;
  chats: GetCommunityChatsResponse | undefined;
  hasMore: boolean | undefined;
  onSend: (message: string) => Promise<void>;
  leaveCommunity: () => Promise<void>;
  deleteCommunity: () => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
  deleteImage: () => Promise<void>;
  pickIconImageByCamera: () => Promise<void>;
  pickIconImageByLibrary: () => Promise<void>;
  pickChatImageByCamera: () => Promise<void>;
  pickChatImageByLibrary: () => Promise<void>;
  readMore: () => void;
  isLoading: boolean;
  isLoadingPostChat: boolean;
  isLoadingUpdateCommunity: boolean;
  isLoadingDeleteCommunity: boolean;
  imagePreviewNavigationHandler: (imageUrl: string, chatId?: number) => void;
  goBackNavigationHandler: () => void;
};

const CommunityChatTemplate = ({
  title,
  owned,
  user,
  chats,
  hasMore,
  onSend,
  leaveCommunity,
  deleteCommunity,
  deleteChat,
  deleteImage,
  pickIconImageByCamera,
  pickIconImageByLibrary,
  pickChatImageByCamera,
  pickChatImageByLibrary,
  readMore,
  isLoading,
  isLoadingPostChat,
  isLoadingUpdateCommunity,
  isLoadingDeleteCommunity,
  imagePreviewNavigationHandler,
  goBackNavigationHandler,
}: CommunityChatTemplateProps) => {
  const { t } = useTranslation(["chat", "community"]);
  const bgColor = useColorModeValue("muted.100", "muted.800");
  const headerColor = useColorModeValue("white", "muted.900");
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
    <Box flex={1} bg={bgColor}>
      <Overlay
        isOpen={isLoadingUpdateCommunity || isLoadingDeleteCommunity}
        loadingEnabled
      />
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
            onPress={onImageActionSheetOpen}
            _pressed={{ bg: pressedColor }}
          >
            <Text fontSize="md">{t("community:changeIcon")}</Text>
          </Menu.Item>
          <Menu.Item
            pl="1"
            onPress={() =>
              Alert.alert(
                owned
                  ? t("community:deleteCommunity")
                  : t("community:leaveCommunity"),
                owned
                  ? t("community:askLeaveCommunity")
                  : t("community:askLeaveCommunity"),
                [
                  {
                    text: t("chat:cancel"),
                    style: "cancel",
                  },
                  {
                    text: owned ? t("chat:delete") : t("community:leave"),
                    onPress: async () =>
                      owned
                        ? await deleteCommunity()
                        : leaveCommunity && (await leaveCommunity()),
                    style: "destructive",
                  },
                ]
              )
            }
            _pressed={{ bg: pressedColor }}
          >
            <Text fontSize="md">
              {owned
                ? t("community:deleteCommunity")
                : t("community:leaveCommunity")}
            </Text>
          </Menu.Item>
        </Menu>
      </HStack>
      {isLoading ? (
        <Center flex={1}>
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
            <Center mt="5">{hasMore && <Spinner color="muted.400" />}</Center>
          }
          renderItem={({ item }) => (
            <ChatItem
              type="community"
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
          !(
            isLoadingUpdateCommunity ||
            isLoadingDeleteCommunity ||
            isChatActionSheetOpen ||
            isImageActionSheetOpen
          )
        }
        onSend={onSend}
        isLoading={isLoadingPostChat}
        pickImageByCamera={pickChatImageByCamera}
        pickImageByLibrary={pickChatImageByLibrary}
      />
    </Box>
  );
};

export default CommunityChatTemplate;
