import React, { memo } from "react";

import {
  Box,
  Divider,
  HStack,
  Pressable,
  Text,
  VStack,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";

import { GetCommunitiesResponse } from "../../hooks/community/query";
import { Category } from "../../types";
import Avatar from "../molecules/Avatar";

type CommunityListItemProps = {
  item: GetCommunitiesResponse[number];
  onPress: () => void;
};

const CommunityListItem = memo(({ item, onPress }: CommunityListItemProps) => {
  const { t } = useTranslation("community");
  const pressedColor = useColorModeValue("muted.100", "muted.800");
  const textColor = useColorModeValue("muted.600", "muted.300");
  return (
    <Pressable onPress={onPress} _pressed={{ bg: pressedColor }} rounded="md">
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
              color={textColor}
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
});

export default CommunityListItem;
