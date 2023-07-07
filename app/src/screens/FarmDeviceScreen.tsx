import React from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import FarmDeviceTemplate from "../components/templates/FarmDeviceTemplate";
import { FarmStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { useQueryDevice } from "../hooks/device";

type FarmDeviceNavigationProp = NativeStackNavigationProp<
  FarmStackParamList,
  "FarmDevice"
>;

type FarmDeviceRouteProp = RouteProp<FarmStackParamList, "FarmDevice">;

const FarmDeviceScreen = () => {
  const navigation = useNavigation<FarmDeviceNavigationProp>();
  const route = useRoute<FarmDeviceRouteProp>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const { data: device } = useQueryDevice(route.params.deviceId);
  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("SettingNavigator", { screen: "Setting" });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <FarmDeviceTemplate
      title={route.params.farmName}
      user={user}
      device={device}
      settingNavigationHandler={settingNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default FarmDeviceScreen;
