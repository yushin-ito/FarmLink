import React from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import FarmDeviceTemplate from "../components/templates/FarmDeviceTemplate";
import { FarmStackParamList, FarmStackScreenProps } from "../types";
import { useCallback } from "react";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { useQueryDevice } from "../hooks/device/query";

const FarmDeviceScreen = () => {
  const { navigation } = useNavigation<FarmStackScreenProps<"FarmDevice">>();
  const route = useRoute<RouteProp<FarmStackParamList, "FarmDevice">>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { data: device } = useQueryDevice(route.params.deviceId);

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
    <FarmDeviceTemplate
      title={route.params.name}
      user={user}
      device={device}
      settingNavigationHandler={settingNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default FarmDeviceScreen;
