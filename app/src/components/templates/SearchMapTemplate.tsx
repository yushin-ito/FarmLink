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
  useColorModeValue,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import SearchBar from "../organisms/SearchBar";
import { TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import SearchMapItem from "../organisms/SearchMapItem";
import { SearchRentalsResponse } from "../../hooks/rental/mutate";
import { SearchFarmsResponse } from "../../hooks/farm/mutate";
import { useTranslation } from "react-i18next";

type SearchMapTemplateProps = {
  type: "rental" | "farm";
  searchRentalsResult: SearchRentalsResponse | undefined;
  searchFarmsResult: SearchFarmsResponse | undefined;
  searchRentals: (query: string) => Promise<void>;
  searchFarms: (query: string) => Promise<void>;
  isLoadingSearchRentals: boolean;
  isLoadingSearchFarms: boolean;
  mapNavigationHandler: (
    regionId: number,
    latitude: number,
    longitude: number
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
  const { t } = useTranslation("map");
  const iconColor = useColorModeValue("muted.600", "muted.100");

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
                  autoFocus={Platform.OS === "ios"}
                  returnKeyType="search"
                  placeholder={t(
                    type === "farm" ? "searchFarm" : "searchRental"
                  )}
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
              icon={
                <Icon as={<Feather name="x" />} size="6" color={iconColor} />
              }
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
                    item.latitude &&
                    item.longitude &&
                    mapNavigationHandler(
                      item.farmId,
                      item.latitude,
                      item.longitude
                    )
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
                    item.latitude &&
                    item.longitude &&
                    mapNavigationHandler(
                      item.rentalId,
                      item.latitude,
                      item.longitude
                    )
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
