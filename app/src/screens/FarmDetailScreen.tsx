import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import FarmDetailTemplate from "../components/templates/FarmDetailTemplate";
import { FarmStackParamList, FarmStackScreenProps } from "../types";
import { useCallback } from "react";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { useQueryDevice } from "../hooks/device/query";
import { useQueryFarm } from "../hooks/farm/query";

const FarmDetailScreen = ({
  navigation,
}: FarmStackScreenProps<"FarmDetail">) => {
  const { params } = useRoute<RouteProp<FarmStackParamList, "FarmDetail">>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const {data: farm, refetch: refetchFarm} = useQueryFarm(params.farmId)
  const { data: device, refetch: refetchDevice } = useQueryDevice(params.deviceId);

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
    <FarmDetailTemplate
      title={params.name}
      user={user}
      device={device}
      settingNavigationHandler={settingNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default FarmDetailScreen;
