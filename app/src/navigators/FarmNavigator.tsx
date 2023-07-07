import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FarmStackParamList } from "../types";
import FarmListScreen from "../screens/FarmListScreen";
import PostFarmModal from "../modals/PostFarmModal";
import FarmDeviceScreen from "../screens/FarmDeviceScreen";

const FarmStack = createNativeStackNavigator<FarmStackParamList>();

const FarmNavigator = () => {
  return (
    <FarmStack.Navigator screenOptions={{ headerShown: false }}>
      <FarmStack.Screen name="FarmList" component={FarmListScreen} />
      <FarmStack.Screen name="FarmDevice" component={FarmDeviceScreen} />
      <FarmStack.Group screenOptions={{ presentation: "fullScreenModal" }}>
        <FarmStack.Screen name="PostFarm" component={PostFarmModal} />
      </FarmStack.Group>
    </FarmStack.Navigator>
  );
};

export default FarmNavigator;
