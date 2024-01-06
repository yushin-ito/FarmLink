import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EnvironmentScreen from "../screens/EnvironmentScreen";
import LikeListScreen from "../screens/LikeListScreen";
import NotificationScreen from "../screens/NotificationScreen";
import PostProfileScreen from "../screens/PostProfileScreen";
import PostRentalScreen from "../screens/PostRentalScreen";
import RentalListScreen from "../screens/RentalListScreen";
import SettingScreen from "../screens/SettingScreen";
import TransferScreen from "../screens/TransferScreen";
import { SettingStackParamList } from "../types";

const SettingStack = createNativeStackNavigator<SettingStackParamList>();

const SettingNavigator = () => {
  return (
    <SettingStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <SettingStack.Screen name="Setting" component={SettingScreen} />
      <SettingStack.Group
        screenOptions={{
          animation: "fade_from_bottom",
          animationDuration: 150,
        }}
      >
        <SettingStack.Screen name="PostProfile" component={PostProfileScreen} />
        <SettingStack.Screen name="PostRental" component={PostRentalScreen} />
        <SettingStack.Screen name="RentalList" component={RentalListScreen} />
        <SettingStack.Screen name="LikeList" component={LikeListScreen} />
        <SettingStack.Screen
          name="Notification"
          component={NotificationScreen}
        />
        <SettingStack.Screen name="Transfer" component={TransferScreen} />
        <SettingStack.Screen name="Environment" component={EnvironmentScreen} />
      </SettingStack.Group>
    </SettingStack.Navigator>
  );
};

export default SettingNavigator;
