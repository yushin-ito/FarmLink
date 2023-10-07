import React, { useCallback, useEffect } from "react";

import { Feather, AntDesign } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, Text, useToast } from "native-base";
import { TabParamList } from "../types";
import MapNavigator from "./MapNavigator";
import FarmNavigator from "./FarmNavigator";
import SettingNavigator from "./SettingNavigator";
import CommunityNavigator from "./CommunityNavigator";
import { Route, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Fab from "../components/molecules/Fab";
import TalkNavigator from "./TalkNavigator";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import useNotification from "../hooks/sdk/useNotification";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import useAuth from "../hooks/auth/useAuth";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { t } = useTranslation([
    "common",
    "map",
    "community",
    "talk",
    "setting",
  ]);
  const toast = useToast();
  const { session } = useAuth();

  useEffect(() => {
    postToken(session?.user.id);
  }, [session]);

  const { postToken } = useNotification({
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("common:permitRequestNoti")}
        />
      );
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("map:error")}
        />
      );
    },
  });

  const getTabStyle = useCallback(
    (route: Partial<Route<string, object | undefined>>) => {
      const routeName = getFocusedRouteNameFromRoute(route);
      if (
        routeName === "SearchMap" ||
        routeName === "RentalDetail" ||
        routeName === "CommunityChat" ||
        routeName === "PostCommunity" ||
        routeName === "SearchCommunity" ||
        routeName === "TalkChat" ||
        routeName === "PostTalk" ||
        routeName === "SearchTalk" ||
        routeName === "FarmDetail" ||
        routeName === "PostFarm" ||
        routeName === "EditFarm" ||
        routeName === "PostProfile" ||
        routeName === "PostRental" ||
        routeName === "EditRental" ||
        routeName === "RentalList"
      )
        return false;

      return true;
    },
    []
  );

  return (
    <Tab.Navigator
      initialRouteName="FarmNavigator"
      screenOptions={({ route }) => ({
        tabHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          display: getTabStyle(route) ? "flex" : "none",
          borderColor: "#e5e5e5",
          borderTopWidth: Platform.OS === "android" ? 1 : 0,
          shadowColor: "#737373",
          shadowOffset: {
            width: 0,
            height: -0.5,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
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
              color={focused ? "brand.600" : "muted.400"}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : "muted.400"}
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
              color={focused ? "brand.600" : "muted.400"}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : "muted.400"}
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
          tabBarButton: ({ onPress }) => (
            <Fab top="-30" onPress={onPress}>
              <Image
                source={require("../../assets/seedling.png")}
                style={{ width: 40, height: 40 }}
              />
            </Fab>
          ),
        }}
      />
      <Tab.Screen
        name="TalkNavigator"
        component={TalkNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              style={{ transform: [{ rotate: "-95deg" }] }}
              as={<Feather />}
              name="message-circle"
              size={focused ? "lg" : "md"}
              color={focused ? "brand.600" : "muted.400"}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : "muted.400"}
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
              color={focused ? "brand.600" : "muted.400"}
              mt="1"
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              fontSize={Platform.OS === "android" ? "2xs" : "xs"}
              color={focused ? "brand.600" : "muted.400"}
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
