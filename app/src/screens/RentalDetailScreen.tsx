import React, { useCallback } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MapStackParamList, MapStackScreenProps } from "../types";
import RentalDetailTemplate from "../components/templates/RentalDetailTemplate";
import { useQueryRental } from "../hooks/rental/query";

const RentalDetailScreen = ({
  navigation,
}: MapStackScreenProps<"RentalDetail">) => {
  const { params } = useRoute<RouteProp<MapStackParamList, "RentalDetail">>();
  const { data: rental } = useQueryRental(params.rentalId);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalDetailTemplate
      rental={rental}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalDetailScreen;
