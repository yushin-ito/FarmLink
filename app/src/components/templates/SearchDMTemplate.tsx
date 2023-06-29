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
import SearchDMItem from "../organisms/SearchDMItem";
import { SearchDMsResponse } from "../../hooks/dm/mutate";

type SearchDMTemplateProps = {
  searchResult: SearchDMsResponse | undefined;
  searchDMs: (query: string) => void;
  isLoadingSearchDMs: boolean;
  dmChatNavigationHandler: (dmId: number, dmName: string | null) => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const SearchDMTemplate = ({
  searchResult,
  searchDMs,
  isLoadingSearchDMs,
  dmChatNavigationHandler,
  goBackNavigationHandler,
}: SearchDMTemplateProps) => {
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
                    searchDMs(text);
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
          {isLoadingSearchDMs ? (
            <Spinner color="muted.400" />
          ) : (
            <FlatList
              w="100%"
              px="9"
              data={searchResult}
              renderItem={({ item }) => (
                <SearchDMItem
                  item={item}
                  dmChatNavigationHandler={dmChatNavigationHandler}
                />
              )}
              keyExtractor={(item) => item.dmId.toString()}
            />
          )}
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default SearchDMTemplate;
