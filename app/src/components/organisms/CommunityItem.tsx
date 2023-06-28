import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { HStack, Icon, IconButton, Pressable, Text } from "native-base";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

type CommunityItemProps = {
  item: GetCommunitiesResponse[number];
  deleteCommunity: (communityId: number) => Promise<void>;
  communityChatNavigationHandler: (
    communityId: number,
    communityName: string | null
  ) => void;
};

const CommunityItem = memo(
  ({
    item,
    deleteCommunity,
    communityChatNavigationHandler,
  }: CommunityItemProps) => {
    const { t } = useTranslation("community");

    return (
      <Pressable
        onPress={() =>
          communityChatNavigationHandler(item.communityId, item.communityName)
        }
      >
        <HStack
          mb="5"
          p="5"
          bg="white"
          shadow="1"
          rounded="lg"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text bold fontSize="md">
            {item.communityName}
          </Text>
          <IconButton
            onPress={() =>
              Alert.alert(t("deleteCommunity"), t("askDeleteCommunity"), [
                {
                  text: t("cancel"),
                  style: "cancel",
                },
                {
                  text: t("delete"),
                  onPress: async () => await deleteCommunity(item.communityId),
                  style: "destructive",
                },
              ])
            }
            _pressed={{
              opacity: 0.5,
            }}
            icon={<Icon as={<Feather />} name="trash" size="5" />}
            variant="ghost"
            colorScheme="muted"
          />
        </HStack>
      </Pressable>
    );
  }
);

export default CommunityItem;
