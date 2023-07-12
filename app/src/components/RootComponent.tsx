import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import RootNavigator from "../navigators/RootNavigator";
import { StatusBar } from "expo-status-bar";

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
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
};

export default RootComponent;
