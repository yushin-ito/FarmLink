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
import CommunityListItem from "../organisms/CommunityListItem";
import Avatar from "../molecules/Avatar";
import SearchBar from "../organisms/SearchBar";
import { GetUserResponse } from "../../hooks/user/query";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import CategoryActionSheet from "../organisms/CategoryActionSheet";
import SkeletonCommunityList from "../organisms/SkeletonCommunityList";
import { RefreshControl } from "react-native";
import { Category } from "../../types";

type CommunityListTemplateProps = {
  categoryIndex: number;
  setCategoryIndex: Dispatch<SetStateAction<number>>;
  user: GetUserResponse | null | undefined;
  communities: GetCommunitiesResponse | null | undefined;
  isLoading: boolean;
  isLoadingUpdateCommunity: boolean;
  isRefetchingCommunities: boolean;
  hasMore: boolean | undefined;
  refetchCommunities: () => Promise<void>;
  joinCommunity: (communityId: number, memberIds: string[]) => Promise<void>;
  readMore: () => void;
  communityChatNavigationHandler: (communityId: number) => void;
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
  isLoadingUpdateCommunity,
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
  const textColor = useColorModeValue("muted.600", "muted.300");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { isOpen, onOpen, onClose } = useDisclose();
  const categories = [
    "all",
    "joined",
    "vegetable",
    "fruit",
    "fertilizer",
    "disease",
  ] as Category[];

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
            text={user?.name?.charAt(0)}
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
          <Text>{t(categories[categoryIndex])}</Text>
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
          mb="20"
          data={communities}
          onEndReached={readMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <Text
              bold
              lineHeight="2xl"
              fontSize="md"
              textAlign="center"
              color={textColor}
            >
              {t("notExistCommunity")}
            </Text>
          }
          ListFooterComponent={
            <Center mt={hasMore ? "4" : "12"}>
              {hasMore && <Spinner color="muted.400" />}
            </Center>
          }
          renderItem={({ item }) => (
            <CommunityListItem
              item={item}
              joined={
                user?.userId === item.ownerId ||
                (item?.memberIds?.some(
                  (memeberId) => user?.userId === memeberId
                ) ??
                  false)
              }
              joinCommunity={joinCommunity}
              isLoading={isLoadingUpdateCommunity}
              communityChatNavigationHandler={communityChatNavigationHandler}
            />
          )}
          keyExtractor={(item) => item.communityId.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingCommunities}
              onRefresh={refetchCommunities}
              tintColor={spinnerColor}
            />
          }
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
