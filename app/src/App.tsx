import React, { useEffect, useRef, useState } from "react";
import { ColorMode, NativeBaseProvider, StorageManager } from "native-base";
import { AuthProvider } from "./contexts/AuthProvider";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import "./i18n";
import { Alert, Appearance, LogBox } from "react-native";
import RootComponent from "./components/RootComponent";
import { extendTheme } from "native-base";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreAllLogs();

const useColorScheme = (delay = 250) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(onColorSchemeChange);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      subscription.remove();
    };
  }, []);

  const onColorSchemeChange = (
    preferences: Appearance.AppearancePreferences
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setColorScheme(preferences.colorScheme);
    }, delay);
  };

  return colorScheme;
};

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
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
        <AuthProvider>
          <RootComponent />
        </AuthProvider>
      </NativeBaseProvider>
    </QueryClientProvider>
  );
};

export default App;
