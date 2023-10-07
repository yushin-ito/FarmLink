import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import RootNavigator from "../navigators/RootNavigator";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorModeValue } from "native-base";

const RootComponent = () => {
  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };
  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#171717",
    },
  };

  return (
    <NavigationContainer theme={useColorModeValue(lightTheme, darkTheme)}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <RootNavigator />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default RootComponent;
