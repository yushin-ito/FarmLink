import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SettingStackParamList } from "../types";
import SettingScreen from "../screens/SettingScreen";
import PostProfileModal from "../modals/PostProfileModal";

const SettingStack = createNativeStackNavigator<SettingStackParamList>();

const SettingNavigator = () => {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingStack.Screen name="Setting" component={SettingScreen} />
      <SettingStack.Group screenOptions={{ presentation: "modal" }}>
        <SettingStack.Screen name="PostProfile" component={PostProfileModal} />
      </SettingStack.Group>
    </SettingStack.Navigator>
  );
};

export default SettingNavigator;
