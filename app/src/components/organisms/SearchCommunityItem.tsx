import React, { memo } from "react";
import { Keyboard } from "react-native";

import { Feather } from "@expo/vector-icons";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  VStack,
  useColorModeValue,
  useDisclose,
  Button,
  Modal,
} from "native-base";
import { useTranslation } from "react-i18next";

import { SearchCommunitiesResponse } from "../../hooks/community/mutate";
import Avatar from "../molecules/Avatar";



type SearchCommunityItemProps = {
  item: SearchCommunitiesResponse[number];
  joined: boolean;
  joinCommunity: (communityId: number, memeberIds: string[]) => Promise<void>;
  isLoading: boolean;
  communityChatNavigationHandler: (communityId: number) => void;
};

const SearchCommunityItem = memo(
  ({
    item,
    joined,
    joinCommunity,
    isLoading,
    communityChatNavigationHandler,
  }: SearchCommunityItemProps) => {
    const { t } = useTranslation("community");
    const bgColor = useColorModeValue("white", "muted.800");
    const pressedColor = useColorModeValue("muted.100", "muted.800");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.600", "muted.100");
    const { isOpen, onOpen, onClose } = useDisclose();

    return (
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          joined ? communityChatNavigationHandler(item.communityId) : onOpen();
        }}
        alignItems="center"
        _pressed={{ bg: pressedColor }}
      >
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <VStack w="75%" px="4" pt="4" pb="2" bg={bgColor} rounded="2xl">
            <Modal.CloseButton _pressed={{ bg: "transparent" }} />
            <VStack mt="6" alignItems="center" space="3">
              <Avatar
                isDisabled
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
                item.name &&
                  (await joinCommunity(
                    item.communityId,

                    item.memberIds ?? []
                  ));

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
        <HStack
          w="100%"
          px="6"
          py="5"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center" space="3">
            <Avatar
              size="9"
              text={item.name?.charAt(0)}
              uri={item.imageUrl}
              color={item.color}
              updatedAt={item.updatedAt}
            />
            <VStack w="80%" space="1">
              <Text bold fontSize="md">
                {item.name}
              </Text>
              <Text
                color={textColor}
                fontSize="xs"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            </VStack>
          </HStack>
          <Icon
            as={<Feather />}
            name="chevron-right"
            size="4"
            ml="2"
            color={iconColor}
          />
        </HStack>
        <Divider w="90%" bg="muted.200" />
      </Pressable>
    );
  }
);

export default SearchCommunityItem;
