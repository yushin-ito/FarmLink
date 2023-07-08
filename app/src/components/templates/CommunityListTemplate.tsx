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
import React, { Dispatch, SetStateAction } from "react";
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
import { Category, getCategories } from "../../functions";

type CommunityListTemplateProps = {
  categoryIndex: number;
  setCategoryIndex: Dispatch<SetStateAction<number>>;
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
  categoryIndex,
  setCategoryIndex,
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
  const { isOpen, onOpen, onClose } = useDisclose();
  const categories = getCategories();
  categories.splice(0, 1, "all");

  return (
    <Box flex={1} safeAreaTop>
      <CategoryActionSheet
        isOpen={isOpen}
        onClose={onClose}
        categoryIndex={categoryIndex}
        setCategoryIndex={setCategoryIndex}
      />
      <VStack space="3" px="8" pt="6" pb="4">
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
      <Pressable onPress={onOpen} alignSelf="flex-end" mr="8" mb="2">
        <HStack
          alignItems="center"
          px="2"
          py="1"
          space="2"
          rounded="full"
          bg="muted.200"
        >
          <Text>{t(categories[categoryIndex] as Category)}</Text>
          <Icon as={<AntDesign name="caretdown" />} size="2" />
        </HStack>
      </Pressable>
      {isLoadingCommunities ? (
        <Spinner color="muted.400" />
      ) : (
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
      )}

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
