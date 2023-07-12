import React, { useCallback, useState } from "react";
import SearchMapTemplate from "../components/templates/SearchMapTemplate";
import { SearchFarmsResponse, useSearchFarms } from "../hooks/farm/mutate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { MapStackScreenProps } from "../types";
import {
  SearchRentalsResponse,
  useSearchRentals,
} from "../hooks/rental/mutate";

const SearchMapScreen = ({ navigation }: MapStackScreenProps<"SearchMap">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();

  const [searchFarmsResult, setSearchFarmsResult] =
    useState<SearchFarmsResponse>();
  const [searchRentalsResult, setSearchRentalsResult] =
    useState<SearchRentalsResponse>();

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

  const searchFarms = useCallback(async (text: string) => {
    if (text === "") {
      setSearchFarmsResult([]);
      return;
    }
    await mutateAsyncSearchFarms(text);
  }, []);

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

  const searchRentals = useCallback(async (text: string) => {
    if (text === "") {
      setSearchRentalsResult([]);
      return;
    }
    await mutateAsyncSearchRentals(text);
  }, []);

  const mapNavigationHandler = useCallback(
    async (latitude: number | null, longitude: number | null) => {
      navigation.navigate("Map", { latitude, longitude });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchMapTemplate
      searchFarmsResult={searchFarmsResult}
      searchRentalsResult={searchRentalsResult}
      searchFarms={searchFarms}
      searchRentals={searchRentals}
      isLoadingSearchFarms={isLoadingSearchFarms}
      isLoadingSearchRentals={isLoadingSearchRentals}
      mapNavigationHandler={mapNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchMapScreen;
