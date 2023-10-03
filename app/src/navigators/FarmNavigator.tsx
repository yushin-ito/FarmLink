import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FarmStackParamList } from "../types";
import FarmListScreen from "../screens/FarmListScreen";
import PostFarmScreen from "../screens/PostFarmScreen";
import FarmDetailScreen from "../screens/FarmDetailScreen";
import EditFarmScreen from "../screens/EditFarmScreen";

const FarmStack = createNativeStackNavigator<FarmStackParamList>();

const FarmNavigator = () => {
  return (
    <FarmStack.Navigator screenOptions={{ headerShown: false }}>
      <FarmStack.Screen name="FarmList" component={FarmListScreen} />
      <FarmStack.Screen name="FarmDetail" component={FarmDetailScreen} />
      <FarmStack.Group screenOptions={{ presentation: "fullScreenModal" }}>
        <FarmStack.Screen name="PostFarm" component={PostFarmScreen} />
        <FarmStack.Screen name="EditFarm" component={EditFarmScreen} />
      </FarmStack.Group>
    </FarmStack.Navigator>
  );
};

export default FarmNavigator;
