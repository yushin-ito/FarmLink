import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FilterRentalScreen from "../screens/FilterRentalScreen";
import MapScreen from "../screens/MapScreen";
import PostRentalScreen from "../screens/PostRentalScreen";
import RentalGridScreen from "../screens/RentalGridScreen";
import SearchMapScreen from "../screens/SearchMapScreen";
import { MapStackParamList } from "../types";

const MapStack = createNativeStackNavigator<MapStackParamList>();

const MapNavigator = () => {
  return (
    <MapStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <MapStack.Screen name="Map" component={MapScreen} />
      <MapStack.Screen name="RentalGrid" component={RentalGridScreen} />

      <MapStack.Group
        screenOptions={{ animation: "none", gestureEnabled: false }}
      >
        <MapStack.Screen name="SearchMap" component={SearchMapScreen} />
      </MapStack.Group>
      <MapStack.Group screenOptions={{ presentation: "containedModal" }}>
        <MapStack.Screen name="PostRental" component={PostRentalScreen} />
        <MapStack.Screen name="FilterRental" component={FilterRentalScreen} />
      </MapStack.Group>
    </MapStack.Navigator>
  );
};

export default MapNavigator;
