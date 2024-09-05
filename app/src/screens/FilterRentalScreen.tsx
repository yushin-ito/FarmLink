import React, { useCallback } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import FilterRentalTemplate from "../components/templates/FilterRentalTemplate";
import { showAlert } from "../functions";
import useLocation from "../hooks/sdk/useLocation";
import { Equipment, MapStackScreenProps, Rate } from "../types";

const FilterRentalScreen = ({
  navigation,
}: MapStackScreenProps<"FilterRental">) => {
  const { t } = useTranslation("map");
  const toast = useToast();

  const { prefectures, cities, getCities, isLoadingCities } = useLocation({
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

  const rentalGridNavigationHandler = useCallback(
    ({
      option,
    }: {
      option?: {
        fee?: { min: string; max: string };
        area?: { min: string; max: string };
        rate?: Rate;
        equipment?: Equipment[];
        prefecture?: string;
        city?: string;
      };
    }) => {
      navigation.navigate("RentalGrid", { option });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <FilterRentalTemplate
      prefectures={[{ id: -1, name: t("all") }].concat(prefectures)}
      cities={[{ id: -1, name: t("all") }].concat(cities)}
      getCities={getCities}
      isLoadingCities={isLoadingCities}
      rentalGridNavigationHandler={rentalGridNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default FilterRentalScreen;
