import React from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import FarmCameraTemplate from "../components/templates/FarmCameraTemplate";
import { FarmStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";

type FarmCameraNavigationProp = NativeStackNavigationProp<
  FarmStackParamList,
  "FarmCamera"
>;

type FarmCameraRouteProp = RouteProp<FarmStackParamList, "FarmCamera">;

const FarmCameraScreen = () => {
  const navigation = useNavigation<FarmCameraNavigationProp>();
  const route = useRoute<FarmCameraRouteProp>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("SettingNavigator", { screen: "Setting" });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <FarmCameraTemplate
      title={route.params.farmName}
      user={user}
      settingNavigationHandler={settingNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default FarmCameraScreen;
