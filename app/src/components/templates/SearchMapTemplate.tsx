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
import SearchMapItem from "../organisms/SearchMapItem";
import { SearchFarmsResponse } from "../../hooks/farm/mutate";
import { SearchRentalsResponse } from "../../hooks/rental/mutate";

type SearchMapTemplateProps = {
  type: "farm" | "rental";
  searchFarmsResult: SearchFarmsResponse | undefined;
  searchRentalsResult: SearchRentalsResponse | undefined;
  searchFarms: (query: string) => Promise<void>;
  searchRentals: (query: string) => Promise<void>;
  isLoadingSearchFarms: boolean;
  isLoadingSearchRentals: boolean;
  mapNavigationHandler: (
    latitude: number | null,
    longitude: number | null
  ) => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const SearchMapTemplate = ({
  type,
  searchFarmsResult,
  searchRentalsResult,
  searchFarms,
  searchRentals,
  isLoadingSearchFarms,
  isLoadingSearchRentals,
  mapNavigationHandler,
  goBackNavigationHandler,
}: SearchMapTemplateProps) => {
  const { control, reset } = useForm<FormValues>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} pt="4" safeAreaTop>
        <VStack space="3">
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
                    searchRentals(text);
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
          {isLoadingSearchFarms || isLoadingSearchRentals ? (
            <Spinner color="muted.400" />
          ) : type === "farm" ? (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={searchFarmsResult}
              renderItem={({ item }) => (
                <SearchMapItem
                  item={item}
                  onPress={() =>
                    mapNavigationHandler(item.latitude, item.longitude)
                  }
                />
              )}
            />
          ) : (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={searchRentalsResult}
              renderItem={({ item }) => (
                <SearchMapItem
                  item={item}
                  onPress={() =>
                    mapNavigationHandler(item.latitude, item.longitude)
                  }
                />
              )}
            />
          )}
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default SearchMapTemplate;
