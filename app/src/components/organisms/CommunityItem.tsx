import React, { memo } from "react";
import { Box, Divider, HStack, Pressable, Text, VStack } from "native-base";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import Avatar from "../molecules/Avatar";
import { useTranslation } from "react-i18next";

type CommunityItemProps = {
  item: GetCommunitiesResponse[number];
  onPress: () => void;
};

const CommunityItem = memo(({ item, onPress }: CommunityItemProps) => {
  const { t } = useTranslation("community");
  return (
    <Pressable onPress={onPress} _pressed={{ bg: "muted.100" }} rounded="md">
      <HStack p="3" minH="32">
        <Box w="25%">
          <Avatar
            size="md"
            fontSize="2xl"
            disabled
            text={item?.communityName?.charAt(0)}
            avatarUrl={item?.imageUrl}
            updatedAt={item?.updatedAt}
            hue={item?.hue}
          />
        </Box>
        <VStack w="75%" justifyContent="space-between">
          <VStack>
            <Text bold fontSize="md">
              {item.communityName}
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
              {t("category")}:{" " + item.category}
            </Text>
          </Box>
        </VStack>
      </HStack>
      <Divider />
    </Pressable>
  );
});

export default CommunityItem;
