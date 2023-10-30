import React, { useCallback } from "react";

import RentalFilterTemplate from "../components/templates/RentalFilterTemplate";
import { MapStackScreenProps } from "../types";

const RentalFilterScreen = ({
  navigation,
}: MapStackScreenProps<"RentalFilter">) => {
    
  const goBackNavigationHandler = useCallback(() => {
    navigation.navigate("RentalGrid")
  }, []);

  return (
    <RentalFilterTemplate goBackNavigationHandler={goBackNavigationHandler} />
  );
};

export default RentalFilterScreen;
