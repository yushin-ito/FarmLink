import React, { useCallback, useState } from "react";
import SearchMapTemplate from "../components/templates/SearchMapTemplate";
import { SearchFarmsResponse, useSearchFarms } from "../hooks/farm/mutate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { MapStackParamList, MapStackScreenProps } from "../types";
import {
  SearchRentalsResponse,
  useSearchRentals,
} from "../hooks/rental/mutate";
import { useRoute, RouteProp } from "@react-navigation/native";

const SearchMapScreen = ({ navigation }: MapStackScreenProps<"SearchMap">) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { params } = useRoute<RouteProp<MapStackParamList, "SearchMap">>();
  const [searchRentalsResult, setSearchRentalsResult] =
    useState<SearchRentalsResponse>();
  const [searchFarmsResult, setSearchFarmsResult] =
    useState<SearchFarmsResponse>();

  const {
    mutateAsync: mutateAsyncSearchRentals,
    isLoading: isLoadingSearchRentals,
  } = useSearchRentals({
    onSuccess: (data) => {
      setSearchRentalsResult(data);
    },
    onError: () => {
      navigation.goBack();
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const searchRentals = useCallback(async (query: string) => {
    if (query === "") {
      setSearchRentalsResult([]);
      return;
    }
    await mutateAsyncSearchRentals(query);
  }, []);

  const {
    mutateAsync: mutateAsyncSearchFarms,
    isLoading: isLoadingSearchFarms,
  } = useSearchFarms({
    onSuccess: (data) => {
      setSearchFarmsResult(data);
    },
    onError: () => {
      navigation.goBack();
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const searchFarms = useCallback(async (query: string) => {
    if (query === "") {
      setSearchFarmsResult([]);
      return;
    }
    await mutateAsyncSearchFarms(query);
  }, []);

  const mapNavigationHandler = useCallback(
    async (regionId: number, latitude: number, longitude: number) => {
      navigation.navigate("Map", {
        regionId,
        latitude,
        longitude,
        type: params.type,
      });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchMapTemplate
      type={params.type}
      searchRentalsResult={searchRentalsResult}
      searchFarmsResult={searchFarmsResult}
      searchRentals={searchRentals}
      searchFarms={searchFarms}
      isLoadingSearchRentals={isLoadingSearchRentals}
      isLoadingSearchFarms={isLoadingSearchFarms}
      mapNavigationHandler={mapNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchMapScreen;
