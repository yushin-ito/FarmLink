import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SettingStackParamList } from "../types";
import SettingScreen from "../screens/SettingScreen";
import PostProfileScreen from "../screens/PostProfileScreen";
import PostRentalScreen from "../screens/PostRentalScreen";
import RentalListScreen from "../screens/RentalListScreen";
import LikeListScreen from "../screens/LikeListScreen";
import NotificationScreen from "../screens/NotificationScreen";
import EnvironmentScreen from "../screens/EnvironmentScreen";

const SettingStack = createNativeStackNavigator<SettingStackParamList>();

const SettingNavigator = () => {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingStack.Screen name="Setting" component={SettingScreen} />
      <SettingStack.Group screenOptions={{ presentation: "containedModal" }}>
        <SettingStack.Screen name="PostProfile" component={PostProfileScreen} />
        <SettingStack.Screen name="PostRental" component={PostRentalScreen} />
        <SettingStack.Screen name="RentalList" component={RentalListScreen} />
        <SettingStack.Screen name="LikeList" component={LikeListScreen} />
        <SettingStack.Screen
          name="Notification"
          component={NotificationScreen}
        />
        <SettingStack.Screen name="Environment" component={EnvironmentScreen} />
      </SettingStack.Group>
    </SettingStack.Navigator>
  );
};

export default SettingNavigator;
