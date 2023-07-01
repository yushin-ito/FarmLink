import React, { memo } from "react";
import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import Avatar from "../molecules/Avatar";
import { useTranslation } from "react-i18next";

type CommunityItemProps = {
  item: GetCommunitiesResponse[number];
  communityChatNavigationHandler: (
    communityId: number,
    communityName: string | null
  ) => void;
};

const CommunityItem = memo(
  ({ item, communityChatNavigationHandler }: CommunityItemProps) => {
    const { t } = useTranslation("community");
    return (
      <Pressable
        onPress={() =>
          communityChatNavigationHandler(item.communityId, item.communityName)
        }
      >
        <HStack
          mb="5"
          p="4"
          space="2"
          bg="white"
          shadow="1"
          rounded="xl"
          alignItems="center"
        >
          <Box w="20%" h="100%" justifyContent="center">
            <Avatar
              size="md"
              disabled
              text={item?.communityName?.charAt(0)}
              avatarUrl={item?.imageUrl}
              updatedAt={item?.updatedAt}
              hue={item?.hue}
            />
          </Box>
          <VStack w="80%">
            <Text bold fontSize="md">
              {item.communityName}
            </Text>
            <Text color="muted.600" fontSize="xs">
              {item.communityDiscription}
            </Text>
            <Box pt="2">
              <Text fontSize="xs">
                {t("category")}:{" " + item.category}
              </Text>
            </Box>
          </VStack>
        </HStack>
      </Pressable>
    );
  }
);

export default CommunityItem;
