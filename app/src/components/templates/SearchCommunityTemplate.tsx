import React from "react";
import { Feather } from "@expo/vector-icons";

import {
  Box,
  VStack,
  HStack,
  IconButton,
  Icon,
  FlatList,
  Spinner,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import SearchBar from "../organisms/SearchBar";
import { GetCommunitiesResponse } from "../../hooks/community/query";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import SearchCommunityItem from "../organisms/SearchCommunityItem";

type SearchCommunityTemplateProps = {
  searchResult: GetCommunitiesResponse | undefined;
  searchCommunities: (query: string) => Promise<void>;
  isLoadingSearchCommunities: boolean;
  communityChatNavigationHandler: (
    communityId: number,
    communityName: string | null
  ) => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const SearchCommunityTemplate = ({
  searchResult,
  searchCommunities,
  isLoadingSearchCommunities,
  communityChatNavigationHandler,
  goBackNavigationHandler,
}: SearchCommunityTemplateProps) => {
  const { control, reset } = useForm<FormValues>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} pt="4" px="2" safeAreaTop>
        <VStack space="7">
          <HStack px="5" alignItems="center" justifyContent="space-between">
            <Controller
              name="query"
              control={control}
              render={({ field: { value, onChange } }) => (
                <SearchBar
                  w="90%"
                  autoFocus
                  returnKeyType="search"
                  InputRightElement={
                    <IconButton
                      onPress={() => reset()}
                      icon={
                        <Icon
                          as={<Feather name="x" />}
                          size="4"
                          color="muted.400"
                        />
                      }
                      variant="unstyled"
                      _pressed={{
                        opacity: 0.5,
                      }}
                    />
                  }
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    searchCommunities(text);
                  }}
                />
              )}
            />
            <IconButton
              onPress={goBackNavigationHandler}
              icon={<Icon as={<Feather name="x" />} size="6" />}
              variant="unstyled"
              _pressed={{
                opacity: 0.5,
              }}
            />
          </HStack>
          {isLoadingSearchCommunities ? (
            <Spinner color="muted.400" />
          ) : (
            <FlatList
              w="100%"
              px="6"
              data={searchResult}
              renderItem={({ item }) => (
                <SearchCommunityItem
                  item={item}
                  onPress={() =>
                    communityChatNavigationHandler(
                      item.communityId,
                      item.communityName
                    )
                  }
                />
              )}
              keyExtractor={(item) => item.communityId.toString()}
            />
          )}
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default SearchCommunityTemplate;
