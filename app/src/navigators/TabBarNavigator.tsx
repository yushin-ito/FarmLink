import React, { useEffect } from "react";

import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, Image } from "native-base";
import { Platform } from "react-native";
import { TabBarParamList } from "../types";
import MapNavigator from "./MapNavigator";
import FarmNavigator from "./FarmNavigator";
import SettingNavigator from "./SettingNavigator";
import CommunityNavigator from "./CommunityNavigator";
import { enableScreens } from "react-native-screens";
import { Route, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import CircleButton from "../components/molecules/CircleButton";
import TalkNavigator from "./TalkNavigator";

const TabBar = createBottomTabNavigator<TabBarParamList>();

const getTabBarStyle = (route: Partial<Route<string, object | undefined>>) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (
    routeName === "CommunityChat" ||
    routeName === "SearchCommunity" ||
    routeName === "FarmCamera" ||
    routeName === "DMChat"
  )
    return false;

  return true;
};

const TabBarNavigator = () => {
  useEffect(() => {
    if (Platform.OS === "ios") {
      enableScreens(false);
    }
  }, []);

  return (
    <TabBar.Navigator
      initialRouteName="FarmNavigator"
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          display: getTabBarStyle(route) ? "flex" : "none",
          borderTopWidth: 0,
          shadowColor: "#414141",
          shadowOffset: {
            width: 0,
            height: -0.5,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 0,
          height: 80,
          paddingTop: 8,
          paddingHorizontal: 10,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <TabBar.Screen
        name="MapNavigator"
        component={MapNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Feather />}
              name="map-pin"
              size={focused ? "xl" : "lg"}
              color={focused ? "brand.600" : "muted.400"}
            />
          ),
        }}
      />
      <TabBar.Screen
        name="CommunityNavigator"
        component={CommunityNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Feather name="message-circle" />}
              size={focused ? "xl" : "lg"}
              color={focused ? "brand.600" : "muted.400"}
            />
          ),
        }}
      />
      <TabBar.Screen
        name="FarmNavigator"
        component={FarmNavigator}
        options={{
          tabBarButton: ({ onPress }) => (
            <CircleButton top="-35" onPress={onPress}>
              <Image
                source={require("../../assets/seedling.png")}
                size="xs"
                alt=""
              />
            </CircleButton>
          ),
        }}
      />
      <TabBar.Screen
        name="TalkNavigator"
        component={TalkNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Feather />}
              name="edit"
              size={focused ? "xl" : "lg"}
              color={focused ? "brand.600" : "muted.400"}
            />
          ),
        }}
      />
      <TabBar.Screen
        name="SettingNavigator"
        component={SettingNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Feather />}
              name="user"
              size={focused ? "xl" : "lg"}
              color={focused ? "brand.600" : "muted.400"}
            />
          ),
        }}
      />
    </TabBar.Navigator>
  );
};

export default TabBarNavigator;
