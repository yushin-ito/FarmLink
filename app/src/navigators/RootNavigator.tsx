import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import useAuth from "../hooks/auth/useAuth";
import TabNavigator from "./TabNavigator";
import AuthNavigator from "./AuthNavigator";
import { Center, Spinner } from "native-base";

import { RootStackParamList } from "../types";
import WalkthroughScreen from "../screens/WalkthroughScreen";
import ImagePreviewScreen from "../screens/ImagePreviewScreen";
import EditFarmScreen from "../screens/EditFarmScreen";
import FarmDetailScreen from "../screens/FarmDetailScreen";
import EditRentalScreen from "../screens/EditRentalScreen";
import RentalDetailScreen from "../screens/RentalDetailScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {session && session?.user.id ? (
        <RootStack.Group>
          <RootStack.Screen name="TabNavigator" component={TabNavigator} />
          <RootStack.Screen
            name="RentalDetail"
            component={RentalDetailScreen}
          />
          <RootStack.Screen name="FarmDetail" component={FarmDetailScreen} />
          <RootStack.Group screenOptions={{ gestureEnabled: false }}>
            <RootStack.Screen
              name="Walkthrough"
              component={WalkthroughScreen}
            />
          </RootStack.Group>
          <RootStack.Group
            screenOptions={{
              gestureDirection: "vertical",
            }}
          >
            <RootStack.Screen
              name="ImagePreview"
              component={ImagePreviewScreen}
            />
          </RootStack.Group>
          <RootStack.Group
            screenOptions={{
              animation: "fade_from_bottom",
              animationDuration: 100,
            }}
          >
            <RootStack.Screen name="EditRental" component={EditRentalScreen} />
            <RootStack.Screen name="EditFarm" component={EditFarmScreen} />
          </RootStack.Group>
        </RootStack.Group>
      ) : (
        <RootStack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
