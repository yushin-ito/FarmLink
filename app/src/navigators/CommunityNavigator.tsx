import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CommunityStackParamList } from "../types";
import CommunityListScreen from "../screens/CommunityListScreen";
import CommunityChatScreen from "../screens/CommunityChatScreen";
import PostCommunityScreen from "../screens/PostCommunityScreen";
import SearchCommunityScreen from "../screens/SearchCommunityScreen";
import ImagePreviewScreen from "../screens/ImagePreviewScreen";

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
      <CommunityStack.Group screenOptions={{ presentation: "fullScreenModal" }}>
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
      <CommunityStack.Group
        screenOptions={{
          gestureDirection: "vertical",
        }}
      >
        <CommunityStack.Screen
          name="ImagePreview"
          component={ImagePreviewScreen}
        />
      </CommunityStack.Group>
    </CommunityStack.Navigator>
  );
};

export default CommunityNavigator;
