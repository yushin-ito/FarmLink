import {
  Box,
  Icon,
  FlatList,
  Heading,
  HStack,
  Spinner,
  Center,
  VStack,
  Text,
  Pressable,
  useDisclose,
} from "native-base";
import React, { useState } from "react";
import CircleButton from "../molecules/CircleButton";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import CommunityItem from "../organisms/CommunityItem";
import { RefreshControl } from "react-native";
import Avatar from "../molecules/Avatar";
import SearchBar from "../organisms/SearchBar";
import { GetUserResponse } from "../../hooks/user/query";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import CategoryActionSheet from "../organisms/CategoryActionSheet";

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
  readMore,
  communityChatNavigationHandler,
  postCommunityNavigationHandler,
  settingNavigationHandler,
  searchCommunityNavigationHandler,
}: CommunityListTemplateProps) => {
  const { t } = useTranslation("community");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclose();

  const categories = [
    t("all"),
    t("none"),
    t("vegetable"),
    t("fruit"),
    t("fertilizer"),
    t("disease"),
  ];

  if (isLoadingCommunities) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <Box flex={1} safeAreaTop>
      <CategoryActionSheet
        isOpen={isOpen}
        onClose={onClose}
        categores={categories}
        setCategoryIndex={setCategoryIndex}
      />
      <VStack space="3" px="9" pt="6" pb="2">
        <HStack alignItems="center" justifyContent="space-between">
          <Heading>{t("community")}</Heading>
          <Avatar
            text={user?.displayName?.charAt(0)}
            avatarUrl={user?.avatarUrl}
            updatedAt={user?.updatedAt}
            hue={user?.hue}
            onPress={settingNavigationHandler}
          />
        </HStack>
        <SearchBar isReadOnly onPressIn={searchCommunityNavigationHandler} />
      </VStack>
      <Pressable onPress={onOpen} alignSelf="flex-end" mr="9" mb="2">
        <HStack
          alignItems="center"
          px="2"
          py="1"
          space="2"
          rounded="full"
          bg="muted.200"
        >
          <Text>{categories[categoryIndex]}</Text>
          <Icon as={<AntDesign name="caretdown" />} size="2" />
        </HStack>
      </Pressable>
      <FlatList
        w="100%"
        px="8"
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
            onPress={() =>
              communityChatNavigationHandler(
                item.communityId,
                item.communityName
              )
            }
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
