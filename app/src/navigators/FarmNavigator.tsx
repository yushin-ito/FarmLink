import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FarmStackParamList } from "../types";
import FarmListScreen from "../screens/FarmListScreen";
import PostFarmScreen from "../screens/PostFarmScreen";

const FarmStack = createNativeStackNavigator<FarmStackParamList>();

const FarmNavigator = () => {
  return (
    <FarmStack.Navigator screenOptions={{ headerShown: false }}>
      <FarmStack.Screen name="FarmList" component={FarmListScreen} />
      <FarmStack.Group screenOptions={{ presentation: "containedModal" }}>
        <FarmStack.Screen name="PostFarm" component={PostFarmScreen} />
      </FarmStack.Group>
    </FarmStack.Navigator>
  );
};

export default FarmNavigator;
