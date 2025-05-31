import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostTalkScreen from "../screens/PostTalkScreen";
import SearchTalkScreen from "../screens/SearchTalkScreen";
import TalkChatScreen from "../screens/TalkChatScreen";
import TalkListScreen from "../screens/TalkListScreen";
import { TalkStackParamList } from "../types";

const TalkStack = createNativeStackNavigator<TalkStackParamList>();

const TalkNavigator = () => {
  return (
    <TalkStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <TalkStack.Screen name="TalkList" component={TalkListScreen} />
      <TalkStack.Group screenOptions={{ gestureEnabled: false }}>
        <TalkStack.Screen name="TalkChat" component={TalkChatScreen} />
      </TalkStack.Group>
      <TalkStack.Group
        screenOptions={{
          animation: "fade_from_bottom",
          animationDuration: 150,
        }}
      >
        <TalkStack.Screen name="PostTalk" component={PostTalkScreen} />
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
