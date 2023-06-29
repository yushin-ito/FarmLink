import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FarmStackParamList } from "../types";
import FarmListScreen from "../screens/FarmListScreen";
import PostFarmModal from "../modals/PostFarnModal";
import FarmCameraScreen from "../screens/FarmCameraScreen";

const FarmStack = createNativeStackNavigator<FarmStackParamList>();

const FarmNavigator = () => {
  return (
    <FarmStack.Navigator screenOptions={{ headerShown: false }}>
      <FarmStack.Screen name="FarmList" component={FarmListScreen} />
      <FarmStack.Screen name="FarmCamera" component={FarmCameraScreen} />
      <FarmStack.Group screenOptions={{ presentation: "modal" }}>
        <FarmStack.Screen name="PostFarm" component={PostFarmModal} />
      </FarmStack.Group>
    </FarmStack.Navigator>
  );
};

export default FarmNavigator;
