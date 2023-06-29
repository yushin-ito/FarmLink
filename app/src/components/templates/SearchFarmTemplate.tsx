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
import SearchFarmItem from "../organisms/SearchFarmItem";
import { SearchFarmsResponse } from "../../hooks/farm/mutate";

type SearchFarmTemplateProps = {
  searchResult: SearchFarmsResponse | undefined;
  searchFarms: (query: string) => void;
  isLoadingSearchFarms: boolean;
  farmDetailNavigationHandler: (farmId: number) => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const SearchFarmTemplate = ({
  searchResult,
  searchFarms,
  isLoadingSearchFarms,
  farmDetailNavigationHandler,
  goBackNavigationHandler,
}: SearchFarmTemplateProps) => {
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
                    searchFarms(text);
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
          {isLoadingSearchFarms ? (
            <Spinner color="muted.400" />
          ) : (
            <FlatList
              w="100%"
              px="9"
              data={searchResult}
              renderItem={({ item }) => (
                <SearchFarmItem
                  item={item}
                  farmDetailNavigationHandler={farmDetailNavigationHandler}
                />
              )}
              keyExtractor={(item) => item.farmId.toString()}
            />
          )}
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default SearchFarmTemplate;
