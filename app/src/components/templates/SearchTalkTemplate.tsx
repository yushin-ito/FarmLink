import React from "react";
import { Feather } from "@expo/vector-icons";

import { Box, VStack, HStack, IconButton, Icon, FlatList } from "native-base";
import { Controller, useForm } from "react-hook-form";
import SearchBar from "../organisms/SearchBar";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import SearchTalkItem from "../organisms/SearchTalkItem";
import { GetTalksResponse } from "../../hooks/talk/query";

type SearchTalkTemplateProps = {
  searchResult: GetTalksResponse | undefined;
  searchTalks: (query: string) => Promise<void>;
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
  talkChatNavigationHandler,
  goBackNavigationHandler,
}: SearchTalkTemplateProps) => {
  const { control, reset } = useForm<FormValues>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} pt="4" safeAreaTop>
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
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={searchResult}
            renderItem={({ item }) => (
              <SearchTalkItem
                item={item}
                onPress={() =>
                  talkChatNavigationHandler(item.talkId, item.to.displayName)
                }
              />
            )}
            keyExtractor={(item) => item.talkId.toString()}
          />
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default SearchTalkTemplate;
