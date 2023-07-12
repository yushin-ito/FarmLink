import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MapStackParamList } from "../types";
import MapScreen from "../screens/MapScreen";
import SearchMapScreen from "../screens/SearchMapScreen";
import RentalDetailScreen from "../screens/RentalDetailScreen";

const MapStack = createNativeStackNavigator<MapStackParamList>();

const MapNavigator = () => {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="Map" component={MapScreen} />
      <MapStack.Screen name="RentalDetail" component={RentalDetailScreen} />
      <MapStack.Group
        screenOptions={{ animation: "none", gestureEnabled: false }}
      >
        <MapStack.Screen name="SearchMap" component={SearchMapScreen} />
      </MapStack.Group>
    </MapStack.Navigator>
  );
};

export default MapNavigator;
