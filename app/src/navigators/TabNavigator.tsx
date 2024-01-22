import React, { useCallback } from "react";
import { Platform } from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Route, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Icon, Text, useColorModeValue } from "native-base";
import { useTranslation } from "react-i18next";

import { TabParamList } from "../types";

import CommunityNavigator from "./CommunityNavigator";
import FarmNavigator from "./FarmNavigator";
import MapNavigator from "./MapNavigator";
import SettingNavigator from "./SettingNavigator";
import TalkNavigator from "./TalkNavigator";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { t } = useTranslation(["map", "community", "talk", "setting"]);
  const bgColor = useColorModeValue("white", "#262626");
  const borderColor = useColorModeValue("#d4d4d4", "#525252");
  const iconColor = useColorModeValue("muted.400", "muted.200");

  const getTabStyle = useCallback(
    (route: Partial<Route<string, object | undefined>>) => {
      const routeName = getFocusedRouteNameFromRoute(route);
      if (
        routeName === "SearchMap" ||
        routeName === "FilterRental" ||
        routeName === "CommunityChat" ||
        routeName === "PostCommunity" ||
        routeName === "SearchCommunity" ||
        routeName === "PostFarm" ||
        routeName === "RecordList" ||
        routeName === "TalkChat" ||
        routeName === "PostTalk" ||
        routeName === "SearchTalk" ||
        routeName === "PostProfile" ||
        routeName === "PostRental" ||
        routeName === "LikeList" ||
        routeName === "Notification" ||
        routeName === "RentalList" ||
        routeName === "Payment" ||
        routeName === "PostRecord" ||
        routeName === "Environment"
      )
        return false;

      return true;
    },
    []
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          display: getTabStyle(route) ? "flex" : "none",
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderTopWidth: 0.5,
          height: Platform.OS === "android" ? 70 : 90,
          paddingTop: 6,
          paddingBottom: Platform.OS === "android" ? 16 : 32,
          paddingHorizontal: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="MapNavigator"
        component={MapNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Feather />}
              name="map-pin"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : iconColor}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : iconColor}
            >
              {t("map:search")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="CommunityNavigator"
        component={CommunityNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Feather />}
              name="users"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : iconColor}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : iconColor}
            >
              {t("community:community")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="FarmNavigator"
        component={FarmNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Feather />}
              name="clipboard"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : iconColor}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : iconColor}
            >
              {t("farm:record")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="TalkNavigator"
        component={TalkNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Feather />}
              name="message-circle"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : iconColor}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : iconColor}
            >
              {t("talk:talk")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="SettingNavigator"
        component={SettingNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<AntDesign />}
              name="setting"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : iconColor}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : iconColor}
            >
              {t("setting:setting")}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
