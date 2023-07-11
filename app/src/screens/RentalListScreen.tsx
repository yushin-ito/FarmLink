import React, { useCallback } from "react";
import RentalListTemplate from "../components/templates/RentalListTemplate";
import { SettingStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useQueryRentals } from "../hooks/rental/query";
import { wait } from "../functions";

const RentalListScreen = ({
  navigation,
}: SettingStackScreenProps<"RentalList">) => {
  const { session } = useAuth();
  const { data: rentals } = useQueryRentals(session?.user.id);

  const mapNavigationHandler = useCallback(
    async (latitude: number | null, longitude: number | null) => {
      navigation.goBack();
      await wait(0.1); // 800ms
      navigation.navigate("TabNavigator", {
        screen: "MapNavigator",
        params: {
          screen: "Map",
          params: { latitude, longitude },
        },
      });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalListTemplate
      rentals={rentals}
      mapNavigationHandler={mapNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalListScreen;
