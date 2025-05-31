import React, { useCallback, useState } from "react";

import { useRoute, RouteProp } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import SearchMapTemplate from "../components/templates/SearchMapTemplate";
import { showAlert } from "../functions";
import { SearchFarmsResponse, useSearchFarms } from "../hooks/farm/mutate";
import {
  SearchRentalsResponse,
  useSearchRentals,
} from "../hooks/rental/mutate";
import { useQueryUser } from "../hooks/user/query";
import { MapStackParamList, MapStackScreenProps } from "../types";

const SearchMapScreen = ({ navigation }: MapStackScreenProps<"SearchMap">) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { params } = useRoute<RouteProp<MapStackParamList, "SearchMap">>();

  const { data: user } = useQueryUser();
  const [searchRentalsResult, setSearchRentalsResult] =
    useState<SearchRentalsResponse>();
  const [searchFarmsResult, setSearchFarmsResult] =
    useState<SearchFarmsResponse>();

  const {
    mutateAsync: mutateAsyncSearchRentals,
    isPending: isLoadingSearchRentals,
  } = useSearchRentals({
    onSuccess: (data) => {
      setSearchRentalsResult(data);
    },
    onError: () => {
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

  const searchRentals = useCallback(
    async (query: string) => {
      if (query === "") {
        setSearchRentalsResult([]);
        return;
      }
      await mutateAsyncSearchRentals({ query, userId: user?.userId });
    },
    [user]
  );

  const {
    mutateAsync: mutateAsyncSearchFarms,
    isPending: isLoadingSearchFarms,
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

  const searchFarms = useCallback(
    async (query: string) => {
      if (query === "") {
        setSearchFarmsResult(undefined);
        return;
      }
      await mutateAsyncSearchFarms({ query, userId: user?.userId });
    },
    [user]
  );

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
