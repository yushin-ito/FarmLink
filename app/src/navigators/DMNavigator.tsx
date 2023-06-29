import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DMStackParamList } from "../types";
import DMListScreen from "../screens/DMListScreen";
import DMChatScreen from "../screens/DMChatScreen";
import PostDMModal from "../modals/PostDMModal";
import SearchDMScreen from "../screens/SearchDMScreen";

const DMStack = createNativeStackNavigator<DMStackParamList>();

const DMNavigator = () => {
  return (
    <DMStack.Navigator screenOptions={{ headerShown: false }}>
      <DMStack.Screen name="DMList" component={DMListScreen} />
      <DMStack.Screen name="DMChat" component={DMChatScreen} />
      <DMStack.Group screenOptions={{ presentation: "modal" }}>
        <DMStack.Screen name="PostDM" component={PostDMModal} />
      </DMStack.Group>
      <DMStack.Group
        screenOptions={{ animation: "none", gestureEnabled: false }}
      >
        <DMStack.Screen name="SearchDM" component={SearchDMScreen} />
      </DMStack.Group>
    </DMStack.Navigator>
  );
};

export default DMNavigator;
