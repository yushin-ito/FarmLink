import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CommunityChatScreen from "../screens/CommunityChatScreen";
import CommunityListScreen from "../screens/CommunityListScreen";
import PostCommunityScreen from "../screens/PostCommunityScreen";
import SearchCommunityScreen from "../screens/SearchCommunityScreen";
import { CommunityStackParamList } from "../types";

const CommunityStack = createNativeStackNavigator<CommunityStackParamList>();

const CommunityNavigator = () => {
  return (
    <CommunityStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <CommunityStack.Screen
        name="CommunityList"
        component={CommunityListScreen}
      />
      <CommunityStack.Screen
        name="CommunityChat"
        component={CommunityChatScreen}
      />
      <CommunityStack.Group
        screenOptions={{
          animation: "fade_from_bottom",
          animationDuration: 100,
        }}
      >
        <CommunityStack.Screen
          name="PostCommunity"
          component={PostCommunityScreen}
        />
      </CommunityStack.Group>
      <CommunityStack.Group
        screenOptions={{ animation: "none", gestureEnabled: false }}
      >
        <CommunityStack.Screen
          name="SearchCommunity"
          component={SearchCommunityScreen}
        />
      </CommunityStack.Group>
    </CommunityStack.Navigator>
  );
};

export default CommunityNavigator;
