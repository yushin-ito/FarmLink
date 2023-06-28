import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DMStackParamList } from "../types";
import DMListScreen from "../screens/DMListScreen";
import DMChatScreen from "../screens/DMChatScreen";
import PostDMModal from "../modals/PostDMModal";

const DMStack = createNativeStackNavigator<DMStackParamList>();

const DMNavigator = () => {
  return (
    <DMStack.Navigator screenOptions={{ headerShown: false }}>
      <DMStack.Screen name="DMList" component={DMListScreen} />
      <DMStack.Screen name="DMChat" component={DMChatScreen} />
      <DMStack.Group screenOptions={{ presentation: "modal" }}>
        <DMStack.Screen name="PostDM" component={PostDMModal} />
      </DMStack.Group>
    </DMStack.Navigator>
  );
};

export default DMNavigator;
