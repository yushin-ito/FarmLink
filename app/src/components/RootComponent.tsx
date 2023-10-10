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
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

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

  const prefix = Linking.createURL("/");

  return (
    <NavigationContainer
      theme={useColorModeValue(lightTheme, darkTheme)}
      linking={{
        prefixes: [prefix],
        subscribe(listener) {
          const urlSubscription = Linking.addEventListener(
            "url",
            ({ url }: { url: string }) => {
              listener(url);
            }
          );

          const notificationSubscription =
            Notifications.addNotificationResponseReceivedListener(
              (response) => {
                const url =
                  response.notification.request.content.data?.scheme ?? "";

                if (url !== "") {
                  listener(`${prefix}${url}`);
                }
              }
            );

          return () => {
            urlSubscription.remove();
            notificationSubscription.remove();
          };
        },
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={useColorModeValue("dark", "light")} />
        <RootNavigator />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
};

export default RootComponent;
