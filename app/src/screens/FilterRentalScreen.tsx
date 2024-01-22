import React, { useCallback } from "react";

import FilterRentalTemplate from "../components/templates/FilterRentalTemplate";
import { MapStackScreenProps } from "../types";

const FilterRentalScreen = ({
  navigation,
}: MapStackScreenProps<"FilterRental">) => {
  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <FilterRentalTemplate goBackNavigationHandler={goBackNavigationHandler} />
  );
};

export default FilterRentalScreen;
