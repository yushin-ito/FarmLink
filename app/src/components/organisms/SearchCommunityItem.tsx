import React from "react";
import { SearchCommunitiesResponse } from "../../hooks/community/mutate";
import { Divider, HStack, Pressable, Text, Icon, Box } from "native-base";
import { Feather } from "@expo/vector-icons";

type SearchCommunityItemProps = {
  item: SearchCommunitiesResponse[number];
  communityChatNavigationHandler: (
    communityId: number,
    communityName: string | null
  ) => void;
};

const SearchCommunityItem = ({
  item,
  communityChatNavigationHandler,
}: SearchCommunityItemProps) => {
  return (
    <Box>
      <Pressable
        onPress={() =>
          communityChatNavigationHandler(item.communityId, item.communityName)
        }
        my="1"
        alignItems="center"
        rounded="md"
        _pressed={{ bg: "muted.300" }}
      >
        <HStack w="100%" px="1" py="3" justifyContent="space-between">
          <Text>{item?.communityName}</Text>
          <Icon as={<Feather />} name="chevron-right" size="4" ml="2" />
        </HStack>
      </Pressable>
      <Divider />
    </Box>
  );
};

export default SearchCommunityItem;
