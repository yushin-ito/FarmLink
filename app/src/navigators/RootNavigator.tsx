import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import useAuth from "../hooks/auth/useAuth";
import TabNavigator from "./TabNavigator";
import AuthNavigator from "./AuthNavigator";
import { Center, Spinner } from "native-base";

import { RootStackParamList } from "../types";
import WalkthroughScreen from "../screens/WalkthroughScreen";

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
    <RootStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      {session && session?.user.id ? (
        <RootStack.Screen name="TabNavigator" component={TabNavigator} />
      ) : (
        <RootStack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
      {session && session?.user.id && (
        <RootStack.Screen name="Walkthrough" component={WalkthroughScreen} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
