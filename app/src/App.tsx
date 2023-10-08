import React from "react";
import { ColorMode, NativeBaseProvider, StorageManager } from "native-base";
import { AuthProvider } from "./contexts/AuthProvider";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import "./i18n";
import { Alert, LogBox, useColorScheme } from "react-native";
import RootComponent from "./components/RootComponent";
import { extendTheme } from "native-base";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreAllLogs();

const App = () => {
  const { t } = useTranslation("common");

  const theme = extendTheme({
    colors: {
      brand: {
        50: "#e3eecd",
        100: "#c7dd9f",
        200: "#c2dc8a",
        300: "#bcda70",
        400: "#a7cf5e",
        500: "#90c447",
        600: "#75a43b",
        700: "#517b2c",
        800: "#3b5c20",
        900: "#152b08",
      },
    },
    config: {
      useSystemColorMode: true,
    },
  });

  const colorScheme = useColorScheme();
  const colorModeManager: StorageManager = {
    get: async () => {
      const theme = await AsyncStorage.getItem("@theme");
      if (!theme) {
        return colorScheme;
      }
      return theme === "dark" ? "dark" : "light";
    },
    set: async (value: ColorMode) => {
      await AsyncStorage.setItem("@theme", value || "");
    },
  };

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (_error, query) => {
        if (query.state.data !== undefined) {
          Alert.alert(t("fetchError"));
        }
      },
    }),
  });

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RootComponent />
        </QueryClientProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
};

export default App;
