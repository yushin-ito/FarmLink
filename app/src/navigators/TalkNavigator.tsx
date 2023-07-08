import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TalkStackParamList } from "../types";
import TalkListScreen from "../screens/TalkListScreen";
import TalkChatScreen from "../screens/TalkChatScreen";
import PostTalkModal from "../screens/PostTalkModal";
import SearchTalkScreen from "../screens/SearchTalkScreen";

const TalkStack = createNativeStackNavigator<TalkStackParamList>();

const TalkNavigator = () => {
  return (
    <TalkStack.Navigator screenOptions={{ headerShown: false }}>
      <TalkStack.Screen name="TalkList" component={TalkListScreen} />
      <TalkStack.Screen name="TalkChat" component={TalkChatScreen} />
      <TalkStack.Group screenOptions={{ presentation: "fullScreenModal" }}>
        <TalkStack.Screen name="PostTalk" component={PostTalkModal} />
      </TalkStack.Group>
      <TalkStack.Group
        screenOptions={{ animation: "none", gestureEnabled: false }}
      >
        <TalkStack.Screen name="SearchTalk" component={SearchTalkScreen} />
      </TalkStack.Group>
    </TalkStack.Navigator>
  );
};

export default TalkNavigator;
