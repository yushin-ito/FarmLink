import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostFarmScreen from "../screens/PostFarmScreen";
import PostRecordScreen from "../screens/PostRecordScreen";
import RecordListScreen from "../screens/RecordListScreen";
import RecordScreen from "../screens/RecordScreen";
import { FarmStackParamList } from "../types";

const FarmStack = createNativeStackNavigator<FarmStackParamList>();

const FarmNavigator = () => {
  return (
    <FarmStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <FarmStack.Screen name="Record" component={RecordScreen} />
      <FarmStack.Screen name="RecordList" component={RecordListScreen} />
      <FarmStack.Group
        screenOptions={{
          animation: "fade_from_bottom",
          animationDuration: 150,
        }}
      >
        <FarmStack.Screen name="PostFarm" component={PostFarmScreen} />
        <FarmStack.Screen name="PostRecord" component={PostRecordScreen} />
      </FarmStack.Group>
    </FarmStack.Navigator>
  );
};

export default FarmNavigator;
