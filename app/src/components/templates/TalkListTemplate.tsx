import {
  Box,
  Icon,
  FlatList,
  Heading,
  HStack,
  Spinner,
  Center,
  VStack,
} from "native-base";
import React from "react";
import CircleButton from "../molecules/CircleButton";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import TalkItem from "../organisms/TalkItem";
import { RefreshControl } from "react-native";
import Avatar from "../molecules/Avatar";
import SearchBar from "../organisms/SearchBar";
import { GetUserResponse } from "../../hooks/user/query";
import { GetTalksResponse } from "../../hooks/talk/query";

type TalkListTemplateProps = {
  user: GetUserResponse | null | undefined;
  talks: GetTalksResponse | null | undefined;
  isLoadingTalks: boolean;
  isRefetchingTalks: boolean;
  hasMore: boolean | undefined;
  refetchTalks: () => Promise<void>;
  deleteTalk: (talkId: number) => Promise<void>;
  readMore: () => void;
  talkChatNavigationHandler: (
    talkId: number,
    displayName: string | null | undefined
  ) => void;
  postTalkNavigationHandler: () => void;
  settingNavigationHandler: () => void;
  searchTalkNavigationHandler: () => void;
};

const TalkListTemplate = ({
  user,
  talks,
  isLoadingTalks,
  isRefetchingTalks,
  hasMore,
  refetchTalks,
  deleteTalk,
  readMore,
  talkChatNavigationHandler,
  postTalkNavigationHandler,
  settingNavigationHandler,
  searchTalkNavigationHandler,
}: TalkListTemplateProps) => {
  const { t } = useTranslation("talk");

  if (isLoadingTalks) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <Box flex={1} safeAreaTop>
      <VStack space="3" px="9" py="6">
        <HStack alignItems="center" justifyContent="space-between">
          <Heading>{t("talk")}</Heading>
          <Avatar
            text={user?.displayName?.charAt(0)}
            avatarUrl={user?.avatarUrl}
            updatedAt={user?.updatedAt}
            hue={user?.hue}
            onPress={settingNavigationHandler}
          />
        </HStack>
        <SearchBar isReadOnly onPressIn={searchTalkNavigationHandler} />
      </VStack>
      <FlatList
        w="100%"
        px="9"
        mb="20"
        data={talks}
        onEndReached={readMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          <Center>{hasMore && <Spinner color="muted.400" />}</Center>
        }
        renderItem={({ item }) => (
          <TalkItem
            item={item}
            deleteTalk={deleteTalk}
            talkChatNavigationHandler={talkChatNavigationHandler}
          />
        )}
        keyExtractor={(item) => item.talkId.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingTalks}
            onRefresh={refetchTalks}
          />
        }
      />
      <CircleButton
        position="absolute"
        bottom="24"
        right="8"
        onPress={postTalkNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </CircleButton>
    </Box>
  );
};

export default TalkListTemplate;
