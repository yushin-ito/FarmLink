import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import RootNavigator from "../navigators/RootNavigator";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootComponent = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <RootNavigator />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default RootComponent;
