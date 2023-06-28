import React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "./contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import "./i18n";
import { customTheme } from "./theme";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/RootNavigator";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreAllLogs();

const queryClient = new QueryClient();

const App = () => {
  return (
    <NativeBaseProvider theme={customTheme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="auto"/>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
};

export default App;
