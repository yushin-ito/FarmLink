import {
  Box,
  Icon,
  FlatList,
  Heading,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Pressable,
} from "native-base";
import React from "react";
import Fab from "../molecules/Fab";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import TalkListItem from "../organisms/TalkListItem";
import { Alert, RefreshControl } from "react-native";
import Avatar from "../molecules/Avatar";
import SearchBar from "../organisms/SearchBar";
import { GetUserResponse } from "../../hooks/user/query";
import { GetTalksResponse } from "../../hooks/talk/query";
import SkeletonTalkList from "../organisms/SkeletonTalkList";

type TalkListTemplateProps = {
  user: GetUserResponse | null | undefined;
  talks: GetTalksResponse | null | undefined;
  isLoading: boolean;
  isRefetchingTalks: boolean;
  refetchTalks: () => Promise<void>;
  deleteTalk: (talkId: number) => Promise<void>;
  talkChatNavigationHandler: (talkId: number) => void;
  postTalkNavigationHandler: () => void;
  settingNavigationHandler: () => void;
  searchTalkNavigationHandler: () => void;
};

const TalkListTemplate = ({
  user,
  talks,
  isLoading,
  isRefetchingTalks,
  refetchTalks,
  deleteTalk,
  talkChatNavigationHandler,
  postTalkNavigationHandler,
  settingNavigationHandler,
  searchTalkNavigationHandler,
}: TalkListTemplateProps) => {
  const { t } = useTranslation("talk");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const textColor = useColorModeValue("muted.600", "muted.300");

  return (
    <Box flex={1} safeAreaTop>
      <VStack space="3" px="8" py="6">
        <HStack alignItems="center" justifyContent="space-between">
          <Heading>{t("talk")}</Heading>
          <Avatar
            text={user?.name?.charAt(0)}
            uri={user?.avatarUrl}
            color={user?.color}
            updatedAt={user?.updatedAt}
            onPress={settingNavigationHandler}
            isLoading={isLoading}
          />
        </HStack>
        <Pressable onPressIn={searchTalkNavigationHandler}>
          <SearchBar
            isReadOnly
            placeholder={t("searchTalk")}
            onPressIn={searchTalkNavigationHandler}
          />
        </Pressable>
      </VStack>
      {isLoading ? (
        <SkeletonTalkList rows={6} />
      ) : (
        <FlatList
          w="100%"
          mb="20"
          data={talks}
          ListEmptyComponent={
            <Text
              bold
              lineHeight="2xl"
              fontSize="md"
              textAlign="center"
              color={textColor}
            >
              {t("notExistTalk")}
            </Text>
          }
          renderItem={({ item }) => (
            <TalkListItem
              item={item}
              onPress={() => talkChatNavigationHandler(item.talkId)}
              onPressRight={() =>
                Alert.alert(t("deleteTalk"), t("askDeleteTalk"), [
                  {
                    text: t("cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("delete"),
                    onPress: async () => await deleteTalk(item.talkId),
                    style: "destructive",
                  },
                ])
              }
            />
          )}
          keyExtractor={(item) => item.talkId.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingTalks}
              onRefresh={refetchTalks}
              tintColor={spinnerColor}
            />
          }
        />
      )}
      <Fab
        position="absolute"
        bottom="24"
        right="6"
        onPress={postTalkNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </Fab>
    </Box>
  );
};

export default TalkListTemplate;
