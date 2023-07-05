import React from "react";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "./contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import "./i18n";
import { LogBox } from "react-native";
import RootComponent from "./components/RootComponent";

LogBox.ignoreAllLogs();

const queryClient = new QueryClient();

import { extendTheme } from "native-base";

export const theme = extendTheme({
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
  components: {},
});

const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RootComponent />
        </QueryClientProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
};

export default App;
