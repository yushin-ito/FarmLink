import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TalkStackParamList } from "../types";
import TalkListScreen from "../screens/TalkListScreen";
import TalkChatScreen from "../screens/TalkChatScreen";
import PostTalkScreen from "../screens/PostTalkScreen";
import SearchTalkScreen from "../screens/SearchTalkScreen";
import ImagePreviewScreen from "../screens/ImagePreviewScreen";

const TalkStack = createNativeStackNavigator<TalkStackParamList>();

const TalkNavigator = () => {
  return (
    <TalkStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <TalkStack.Screen name="TalkList" component={TalkListScreen} />
      <TalkStack.Screen name="TalkChat" component={TalkChatScreen} />
      <TalkStack.Group
        screenOptions={{
          animation: "fade_from_bottom",
          animationDuration: 100,
        }}
      >
        <TalkStack.Screen name="PostTalk" component={PostTalkScreen} />
      </TalkStack.Group>
      <TalkStack.Group
        screenOptions={{ animation: "none", gestureEnabled: false }}
      >
        <TalkStack.Screen name="SearchTalk" component={SearchTalkScreen} />
      </TalkStack.Group>
      <TalkStack.Group
        screenOptions={{
          gestureDirection: "vertical",
        }}
      >
        <TalkStack.Screen name="ImagePreview" component={ImagePreviewScreen} />
      </TalkStack.Group>
    </TalkStack.Navigator>
  );
};

export default TalkNavigator;
