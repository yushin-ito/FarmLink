import React, { useCallback } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MapStackParamList, MapStackScreenProps } from "../types";
import RentalDetailTemplate from "../components/templates/RentalDetailTemplate";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { useQueryRental } from "../hooks/rental/query";

const RentalDetailScreen = ({
  navigation,
}: MapStackScreenProps<"RentalDetail">) => {
  const { params } = useRoute<RouteProp<MapStackParamList, "RentalDetail">>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { data: rental } = useQueryRental(params.rentalId);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("TabNavigator", {
      screen: "SettingNavigator",
      params: {
        screen: "Setting",
      },
    });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalDetailTemplate
      user={user}
      rental={rental}
      settingNavigationHandler={settingNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalDetailScreen;
