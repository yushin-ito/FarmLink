import React from "react";

import { Ionicons, SimpleLineIcons, AntDesign } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, Text } from "native-base";
import { TabParamList } from "../types";
import MapNavigator from "./MapNavigator";
import FarmNavigator from "./FarmNavigator";
import SettingNavigator from "./SettingNavigator";
import CommunityNavigator from "./CommunityNavigator";
import { Route, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import CircleButton from "../components/molecules/CircleButton";
import TalkNavigator from "./TalkNavigator";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";

const Tab = createBottomTabNavigator<TabParamList>();

const getTabStyle = (route: Partial<Route<string, object | undefined>>) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (
    routeName === "SearchMap" ||
    routeName === "CommunityChat" ||
    routeName === "PostCommunity" ||
    routeName === "SearchCommunity" ||
    routeName === "TalkChat" ||
    routeName === "PostTalk" ||
    routeName === "SearchTalk" ||
    routeName === "FarmDevice" ||
    routeName === "PostFarm" ||
    routeName === "PostProfile" ||
    routeName === "PostRental"
  )
    return false;

  return true;
};

const TabNavigator = () => {
  const { t } = useTranslation(["map", "community", "talk", "setting"]);

  return (
    <Tab.Navigator
      initialRouteName="FarmNavigator"
      screenOptions={({ route }) => ({
        tabHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          display: getTabStyle(route) ? "flex" : "none",
          borderTopWidth: 0,
          shadowColor: "#414141",
          shadowOffset: {
            width: 0,
            height: -0.5,
          },
          minHeight: 64,
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 24,
          paddingTop: 12,
          paddingHorizontal: 10,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
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
              as={<SimpleLineIcons />}
              name="location-pin"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : "muted.400"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text fontSize="xs" color={focused ? "brand.600" : "muted.400"}>
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
              as={<AntDesign />}
              name="team"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : "muted.400"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text fontSize="xs" color={focused ? "brand.600" : "muted.400"}>
              {t("community:community")}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="FarmNavigator"
        component={FarmNavigator}
        options={{
          tabBarButton: ({ onPress }) => (
            <CircleButton top="-35" onPress={onPress}>
              <Image
                source={require("../../assets/seedling.png")}
                style={{ width: 40, height: 40 }}
              />
            </CircleButton>
          ),
        }}
      />
      <Tab.Screen
        name="TalkNavigator"
        component={TalkNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              as={<Ionicons />}
              name="ios-chatbubble-ellipses-outline"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : "muted.400"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text fontSize="xs" color={focused ? "brand.600" : "muted.400"}>
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
              as={<Ionicons />}
              name="ios-settings-outline"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : "muted.400"}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text fontSize="xs" color={focused ? "brand.600" : "muted.400"}>
              {t("setting:setting")}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
