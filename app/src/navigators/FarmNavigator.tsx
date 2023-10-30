import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FarmListScreen from "../screens/FarmListScreen";
import PostFarmScreen from "../screens/PostFarmScreen";
import { FarmStackParamList } from "../types";

const FarmStack = createNativeStackNavigator<FarmStackParamList>();

const FarmNavigator = () => {
  return (
    <FarmStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <FarmStack.Screen name="FarmList" component={FarmListScreen} />
      <FarmStack.Group
        screenOptions={{
          animation: "fade_from_bottom",
          animationDuration: 150,
        }}
      >
        <FarmStack.Screen name="PostFarm" component={PostFarmScreen} />
      </FarmStack.Group>
    </FarmStack.Navigator>
  );
};

export default FarmNavigator;
