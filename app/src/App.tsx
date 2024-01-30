import React from "react";
import { LogBox } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  extendTheme,
  ColorMode,
  NativeBaseProvider,
  StorageManager,
} from "native-base";

import "./i18n";

import RootComponent from "./components/RootComponent";
import { AuthProvider } from "./contexts/AuthProvider";
import useColorScheme from "./hooks/sdk/useColorScheme";

LogBox.ignoreAllLogs();
// Splash.preventAutoHideAsync();

/*const AppLoader = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  if (isReady) {
    return <>{children}</>;
  }

  return <SplashScreen setIsReady={setIsReady} />;
};*/

const App = () => {
  const theme = extendTheme({
    components: {
      Heading: {
        baseStyle: {
          color: "muted.700",
        },
      },
      Text: {
        baseStyle: {
          color: "muted.700",
        },
      },
    },
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
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootComponent />
        </AuthProvider>
      </QueryClientProvider>
    </NativeBaseProvider>
  );
};

export default App;
