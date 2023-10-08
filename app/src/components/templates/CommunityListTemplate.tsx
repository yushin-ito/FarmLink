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
  useColorModeValue,
} from "native-base";
import React, { Dispatch, SetStateAction } from "react";
import Fab from "../molecules/Fab";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import CommunityItem from "../organisms/CommunityItem";
import Avatar from "../molecules/Avatar";
import SearchBar from "../organisms/SearchBar";
import { GetUserResponse } from "../../hooks/user/query";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import CategoryActionSheet from "../organisms/CategoryActionSheet";
import { Category, getCategories } from "../../functions";
import SkeletonCommunityList from "../organisms/SkeletonCommunityList";

type CommunityListTemplateProps = {
  categoryIndex: number;
  setCategoryIndex: Dispatch<SetStateAction<number>>;
  user: GetUserResponse | null | undefined;
  communities: GetCommunitiesResponse | null | undefined;
  isLoading: boolean;
  isLoadingPostCommunity: boolean;
  isRefetchingCommunities: boolean;
  hasMore: boolean | undefined;
  refetchCommunities: () => Promise<void>;
  joinCommunity: (
    communityId: number,
    name: string | null,
    memberIds: string[]
  ) => Promise<void>;
  readMore: () => void;
  communityChatNavigationHandler: (
    communityId: number,
    name: string | null
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
  isLoading,
  isLoadingPostCommunity,
  isRefetchingCommunities,
  hasMore,
  refetchCommunities,
  joinCommunity,
  readMore,
  communityChatNavigationHandler,
  postCommunityNavigationHandler,
  settingNavigationHandler,
  searchCommunityNavigationHandler,
}: CommunityListTemplateProps) => {
  const { t } = useTranslation("community");
  const bgColor = useColorModeValue("muted.200", "muted.700");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { isOpen, onOpen, onClose } = useDisclose();
  const categories = getCategories();
  categories.splice(0, 1, "all", "joined");

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
            text={user?.name.charAt(0)}
            uri={user?.avatarUrl}
            color={user?.color}
            onPress={settingNavigationHandler}
            updatedAt={user?.updatedAt}
            isLoading={isLoading}
          />
        </HStack>
        <SearchBar
          isReadOnly
          placeholder={t("searchCommunity")}
          onPressIn={searchCommunityNavigationHandler}
        />
      </VStack>
      <Pressable onPress={onOpen} alignSelf="flex-end" mr="8" mb="2">
        <HStack
          alignItems="center"
          px="2"
          py="1"
          space="2"
          rounded="full"
          bg={bgColor}
        >
          <Text>{t(categories[categoryIndex] as Category)}</Text>
          <Icon
            as={<AntDesign name="caretdown" />}
            size="2"
            color={iconColor}
          />
        </HStack>
      </Pressable>
      {isLoading ? (
        <SkeletonCommunityList rows={4} />
      ) : (
        <FlatList
          w="100%"
          mb="20"
          data={communities}
          onEndReached={readMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            <Center mt={hasMore ? "0" : "12"}>
              {hasMore && <Spinner color="muted.400" />}
            </Center>
          }
          renderItem={({ item }) => (
            <CommunityItem
              item={item}
              joined={
                user?.userId === item.ownerId ||
                (item?.memberIds?.some(
                  (memeberId) => user?.userId === memeberId
                ) ??
                  false)
              }
              joinCommunity={joinCommunity}
              isLoading={isLoadingPostCommunity}
              communityChatNavigationHandler={communityChatNavigationHandler}
            />
          )}
          keyExtractor={(item) => item.communityId.toString()}
          refreshing={isRefetchingCommunities}
          onRefresh={refetchCommunities}
        />
      )}
      <Fab
        position="absolute"
        bottom="24"
        right="6"
        onPress={postCommunityNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </Fab>
    </Box>
  );
};

export default CommunityListTemplate;
