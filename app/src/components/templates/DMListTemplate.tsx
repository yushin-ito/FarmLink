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
import DMItem from "../organisms/DMItem";
import { RefreshControl } from "react-native";
import Avatar from "../molecules/Avatar";
import SearchBar from "../organisms/SearchBar";
import { GetUserResponse } from "../../hooks/user/query";
import { GetDMsResponse } from "../../hooks/dm/query";

type DMListTemplateProps = {
  user: GetUserResponse | null | undefined;
  dms: GetDMsResponse | null | undefined;
  isLoadingDMs: boolean;
  isRefetchingDMs: boolean;
  hasMore: boolean | undefined;
  refetchDMs: () => Promise<void>;
  deleteDM: (dmId: number) => Promise<void>;
  readMore: () => void;
  dmChatNavigationHandler: (dmId: number, dmName: string | null) => void;
  postDMNavigationHandler: () => void;
  settingNavigationHandler: () => void;
  searchDMNavigationHandler: () => void;
};

const DMListTemplate = ({
  user,
  dms,
  isLoadingDMs,
  isRefetchingDMs,
  hasMore,
  refetchDMs,
  deleteDM,
  readMore,
  dmChatNavigationHandler,
  postDMNavigationHandler,
  settingNavigationHandler,
  searchDMNavigationHandler,
}: DMListTemplateProps) => {
  const { t } = useTranslation("dm");

  if (isLoadingDMs) {
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
          <Heading>{t("dm")}</Heading>
          <Avatar user={user} onPress={settingNavigationHandler} />
        </HStack>
        <SearchBar isReadOnly onPressIn={searchDMNavigationHandler} />
      </VStack>
      <FlatList
        w="100%"
        px="9"
        data={dms}
        onEndReached={readMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          <Center>{hasMore && <Spinner color="muted.400" />}</Center>
        }
        renderItem={({ item }) => (
          <DMItem
            item={item}
            deleteDM={deleteDM}
            dmChatNavigationHandler={dmChatNavigationHandler}
          />
        )}
        keyExtractor={(item) => item.dmId.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingDMs}
            onRefresh={refetchDMs}
          />
        }
      />
      <CircleButton
        position="absolute"
        bottom="24"
        right="8"
        onPress={postDMNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </CircleButton>
    </Box>
  );
};

export default DMListTemplate;
