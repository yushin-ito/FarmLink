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
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import SearchTalkItem from "../organisms/SearchTalkItem";
import { SearchTalksResponse } from "../../hooks/talk/mutate";

type SearchTalkTemplateProps = {
  searchResult: SearchTalksResponse | undefined;
  searchTalks: (query: string) => void;
  isLoadingSearchTalks: boolean;
  talkChatNavigationHandler: (
    talkId: number,
    displayName: string | null | undefined
  ) => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const SearchTalkTemplate = ({
  searchResult,
  searchTalks,
  isLoadingSearchTalks,
  talkChatNavigationHandler,
  goBackNavigationHandler,
}: SearchTalkTemplateProps) => {
  const { control, reset } = useForm<FormValues>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box
        flex={1}
        pt="4"
        pb="12"
        px="2"
        justifyContent="space-between"
        safeAreaTop
      >
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
                    searchTalks(text);
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
          {isLoadingSearchTalks ? (
            <Spinner color="muted.400" />
          ) : (
            <FlatList
              w="100%"
              px="9"
              data={searchResult}
              renderItem={({ item }) => (
                <SearchTalkItem
                  item={item}
                  talkChatNavigationHandler={talkChatNavigationHandler}
                />
              )}
              keyExtractor={(item) => item.talkId.toString()}
            />
          )}
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default SearchTalkTemplate;
