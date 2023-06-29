import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MapStackParamList } from "../types";
import MapScreen from "../screens/MapScreen";
import SearchFarmScreen from "../screens/SearchFarmScreen";

const MapStack = createNativeStackNavigator<MapStackParamList>();

const MapNavigator = () => {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="Map" component={MapScreen} />
      <MapStack.Group
        screenOptions={{ animation: "none", gestureEnabled: false }}
      >
        <MapStack.Screen
          name="SearchFarm"
          component={SearchFarmScreen}
        />
      </MapStack.Group>
    </MapStack.Navigator>
  );
};

export default MapNavigator;
