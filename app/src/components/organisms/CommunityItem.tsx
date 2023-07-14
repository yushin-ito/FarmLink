import React, { memo } from "react";
import { Box, Divider, HStack, Pressable, Text, VStack } from "native-base";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import Avatar from "../molecules/Avatar";
import { useTranslation } from "react-i18next";
import { Category } from "../../functions";

type CommunityItemProps = {
  item: GetCommunitiesResponse[number];
  onPress: () => void;
};

const CommunityItem = memo(({ item, onPress }: CommunityItemProps) => {
  const { t } = useTranslation("community");
  return (
    <Pressable onPress={onPress} _pressed={{ bg: "muted.100" }} rounded="md">
      <HStack px="9" py="3" h="32">
        <Box w="25%">
          <Avatar
            size="md"
            fontSize="2xl"
            disabled
            text={item.name.charAt(0)}
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
          <Box pt="2">
            <Text fontSize="xs">
              {t("category")}:{" " + t(item.category as Category)}
            </Text>
          </Box>
        </VStack>
      </HStack>
      <Divider w="80%" alignSelf="center" bg="muted.200" />
    </Pressable>
  );
});

export default CommunityItem;
