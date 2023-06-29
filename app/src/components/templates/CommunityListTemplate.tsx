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
import CommunityItem from "../organisms/CommunityItem";
import { RefreshControl } from "react-native";
import Avatar from "../molecules/Avatar";
import SearchBar from "../organisms/SearchBar";
import { GetUserResponse } from "../../hooks/user/query";
import { GetCommunitiesResponse } from "../../hooks/community/query";

type CommunityListTemplateProps = {
  user: GetUserResponse | null | undefined;
  communities: GetCommunitiesResponse | null | undefined;
  isLoadingCommunities: boolean;
  isRefetchingCommunities: boolean;
  hasMore: boolean | undefined;
  refetchCommunities: () => Promise<void>;
  deleteCommunity: (communityId: number) => Promise<void>;
  readMore: () => void;
  communityChatNavigationHandler: (
    communityId: number,
    communityName: string | null
  ) => void;
  postCommunityNavigationHandler: () => void;
  settingNavigationHandler: () => void;
  searchCommunityNavigationHandler: () => void;
};

const CommunityListTemplate = ({
  user,
  communities,
  isLoadingCommunities,
  isRefetchingCommunities,
  hasMore,
  refetchCommunities,
  deleteCommunity,
  readMore,
  communityChatNavigationHandler,
  postCommunityNavigationHandler,
  settingNavigationHandler,
  searchCommunityNavigationHandler,
}: CommunityListTemplateProps) => {
  const { t } = useTranslation("community");

  if (isLoadingCommunities) {
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
          <Heading>{t("community")}</Heading>
          <Avatar user={user} onPress={settingNavigationHandler} />
        </HStack>
        <SearchBar isReadOnly onPressIn={searchCommunityNavigationHandler} />
      </VStack>
      <FlatList
        w="100%"
        px="9"
        mb="20"
        data={communities}
        onEndReached={readMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          <Center>{hasMore && <Spinner color="muted.400" />}</Center>
        }
        renderItem={({ item }) => (
          <CommunityItem
            item={item}
            deleteCommunity={deleteCommunity}
            communityChatNavigationHandler={communityChatNavigationHandler}
          />
        )}
        keyExtractor={(item) => item.communityId.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingCommunities}
            onRefresh={refetchCommunities}
          />
        }
      />
      <CircleButton
        position="absolute"
        bottom="24"
        right="8"
        onPress={postCommunityNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </CircleButton>
    </Box>
  );
};

export default CommunityListTemplate;
