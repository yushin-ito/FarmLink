import React, { Dispatch, SetStateAction, useState } from "react";
import { RefreshControl } from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
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
  Modal,
  Button,
} from "native-base";
import { useTranslation } from "react-i18next";

import { GetCommunitiesResponse } from "../../hooks/community/query";
import { GetUserResponse } from "../../hooks/user/query";
import { Category } from "../../types";
import Avatar from "../molecules/Avatar";
import Fab from "../molecules/Fab";
import CategoryActionSheet from "../organisms/CategoryActionSheet";
import CommunityListItem from "../organisms/CommunityListItem";
import SearchBar from "../organisms/SearchBar";
import SkeletonCommunityList from "../organisms/SkeletonCommunityList";

type CommunityListTemplateProps = {
  categoryIndex: number;
  setCategoryIndex: Dispatch<SetStateAction<number>>;
  user: GetUserResponse | undefined;
  communities: GetCommunitiesResponse | undefined;
  refetchCommunities: () => Promise<void>;
  joinCommunity: (communityId: number, memberIds: string[]) => Promise<void>;
  hasMore: boolean | undefined;
  readMore: () => void;
  isLoading: boolean;
  isLoadingUpdateCommunity: boolean;
  isRefetchingCommunities: boolean;
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
  refetchCommunities,
  joinCommunity,
  hasMore,
  readMore,
  isLoading,
  isLoadingUpdateCommunity,
  isRefetchingCommunities,
  communityChatNavigationHandler,
  postCommunityNavigationHandler,
  settingNavigationHandler,
  searchCommunityNavigationHandler,
}: CommunityListTemplateProps) => {
  const { t } = useTranslation("community");
  const bgColor = useColorModeValue("muted.200", "muted.700");
  const modalColor = useColorModeValue("white", "muted.800");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const {
    isOpen: isOpenCategoryActionSheet,
    onOpen: onOpenCategoryActionSheet,
    onClose: onCloseCategoryActionSheet,
  } = useDisclose();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclose();
  const [content, setContent] = useState<GetCommunitiesResponse[number]>();
  const categories = [
    "all",
    "joining",
    "vegetable",
    "fruit",
    "fertilizer",
    "disease",
  ] as Category[];

  return (
    <Box flex={1} safeAreaTop>
      <CategoryActionSheet
        isOpen={isOpenCategoryActionSheet}
        onClose={onCloseCategoryActionSheet}
        categoryIndex={categoryIndex}
        setCategoryIndex={setCategoryIndex}
      />
      {content && (
        <Modal isOpen={isOpenModal} onClose={onCloseModal} size="lg">
          <VStack w="75%" px="4" pt="4" pb="2" bg={modalColor} rounded="2xl">
            <Modal.CloseButton _pressed={{ bg: "transparent" }} />
            <VStack mt="6" alignItems="center" space="3">
              <Avatar
                size="xl"
                fontSize="5xl"
                disabled
                text={content.name?.charAt(0)}
                uri={content.imageUrl}
                color={content.color}
                updatedAt={content.updatedAt}
              />
              <VStack alignItems="center" space="2">
                <Text bold fontSize="lg">
                  {content.name}
                </Text>
                <Text numberOfLines={3} ellipsizeMode="tail">
                  {content.description}
                </Text>
              </VStack>
            </VStack>
            <Button
              mt="8"
              size="lg"
              rounded="lg"
              colorScheme="brand"
              isLoading={isLoadingUpdateCommunity}
              onPress={async () => {
                content &&
                  (await joinCommunity(
                    content.communityId,
                    content.memberIds ?? []
                  ));
                onCloseModal();
              }}
            >
              <Text bold fontSize="md" color="white">
                {t("join")}
              </Text>
            </Button>
            <Button mt="2" variant="unstyled" onPress={onCloseModal}>
              <Text bold fontSize="md" color="brand.600">
                {t("cancel")}
              </Text>
            </Button>
          </VStack>
        </Modal>
      )}
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
        <Pressable onPressIn={searchCommunityNavigationHandler}>
          <SearchBar
            isReadOnly
            placeholder={t("searchCommunity")}
            onPressIn={searchCommunityNavigationHandler}
          />
        </Pressable>
      </VStack>
      <Pressable
        onPress={onOpenCategoryActionSheet}
        alignSelf="flex-end"
        mr="8"
        mb="2"
      >
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
              onPress={() => {
                setContent(item);
                categories[categoryIndex] === "joining"
                  ? communityChatNavigationHandler(item.communityId)
                  : onOpenModal();
              }}
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
