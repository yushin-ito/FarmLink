import React, { memo } from "react";
import {
  Box,
  Button,
  Divider,
  HStack,
  Modal,
  Pressable,
  Text,
  VStack,
  useDisclose,
} from "native-base";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import Avatar from "../molecules/Avatar";
import { useTranslation } from "react-i18next";
import { Category } from "../../functions";

type CommunityItemProps = {
  item: GetCommunitiesResponse[number];
  joined: boolean;
  joinCommunity: (
    communityId: number,
    name: string | null,
    memeberIds: string[]
  ) => Promise<void>;
  isLoading: boolean;
  communityChatNavigationHandler: (
    communityId: number,
    name: string | null
  ) => void;
};

const CommunityItem = memo(
  ({
    item,
    joined,
    joinCommunity,
    isLoading,
    communityChatNavigationHandler,
  }: CommunityItemProps) => {
    const { t } = useTranslation("community");
    const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclose();

    return (
      <Pressable
        onPress={() =>
          joined
            ? communityChatNavigationHandler(item.communityId, item.name)
            : onOpen()
        }
        _pressed={{ bg: "muted.100" }}
        rounded="md"
      >
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <VStack w="75%" px="4" pt="4" pb="2" bg="#f2f2f2" rounded="2xl">
            <Modal.CloseButton />
            <VStack mt="6" alignItems="center" space="3">
              <Avatar
                size="xl"
                fontSize="5xl"
                disabled
                text={item.name?.charAt(0)}
                uri={item.imageUrl}
                color={item.color}
                updatedAt={item.updatedAt}
              />
              <VStack alignItems="center" space="2">
                <Text bold fontSize="lg">
                  {item.name}
                </Text>
                <Text numberOfLines={3} ellipsizeMode="tail">
                  {item.description}
                </Text>
              </VStack>
            </VStack>
            <Button
              mt="8"
              size="lg"
              rounded="lg"
              colorScheme="brand"
              isLoading={isLoading}
              onPress={async () => {
                await joinCommunity(
                  item.communityId,
                  item.name,
                  item.memberIds ?? []
                );
                onClose();
              }}
            >
              <Text bold fontSize="md" color="white">
                {t("join")}
              </Text>
            </Button>
            <Button mt="2" variant="unstyled" onPress={onClose}>
              <Text bold fontSize="md" color="brand.600">
                {t("cancel")}
              </Text>
            </Button>
          </VStack>
        </Modal>
        <HStack px="9" py="3" h="32">
          <Box w="25%">
            <Avatar
              size="md"
              fontSize="2xl"
              disabled
              text={item.name?.charAt(0)}
              uri={item.imageUrl}
              color={item.color}
              updatedAt={item.updatedAt}
            />
          </Box>
          <VStack w="75%" justifyContent="space-between">
            <VStack>
              <Text bold fontSize="md">
                {item.name}
              </Text>
              <Text
                color="muted.600"
                fontSize="xs"
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </VStack>
            <HStack pt="2" space="4">
              <Text fontSize="xs">
                {t("member")}:{" " + ((item.memberIds?.length ?? 0) + 1)}
              </Text>
              <Text fontSize="xs">
                {t("category")}:{" " + t(item.category as Category)}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <Divider w="80%" alignSelf="center" bg="muted.200" />
      </Pressable>
    );
  }
);

export default CommunityItem;
