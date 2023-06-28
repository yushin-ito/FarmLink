import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CommunityStackParamList } from "../types";
import CommunityListScreen from "../screens/CommunityListScreen";
import CommunityChatScreen from "../screens/CommunityChatScreen";
import PostCommunityModal from "../modals/PostCommunityModal";
import SearchCommunityScreen from "../screens/SearchCommunityScreen";

const CommunityStack = createNativeStackNavigator<CommunityStackParamList>();

const CommunityNavigator = () => {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunityStack.Screen
        name="CommunityList"
        component={CommunityListScreen}
      />
      <CommunityStack.Screen
        name="CommunityChat"
        component={CommunityChatScreen}
      />
      <CommunityStack.Group screenOptions={{ presentation: "modal" }}>
        <CommunityStack.Screen
          name="PostCommunity"
          component={PostCommunityModal}
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
