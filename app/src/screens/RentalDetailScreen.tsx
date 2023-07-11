import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MapStackParamList } from "../types";
import RentalDetailTemplate from "../components/templates/RentalDetailTemplate";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";

type RentalDetailNavigationProp = NativeStackNavigationProp<
  MapStackParamList,
  "RentalDetail"
>;

const RentalDetailScreen = () => {
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const navigation = useNavigation<RentalDetailNavigationProp>();

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("SettingNavigator", { screen: "Setting" });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalDetailTemplate
      user={user}
      settingNavigationHandler={settingNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalDetailScreen;
