import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  AuthNavigator: undefined;
  TabBarNavigator: undefined;
};

export type AuthStackParamList = {
  Provider: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type TabBarParamList = {
  MapNavigator: undefined;
  CommunityNavigator: undefined;
  FarmNavigator: undefined;
  TalkNavigator: undefined;
  SettingNavigator: undefined;
};

export type CommunityStackParamList = {
  CommunityList: undefined;
  CommunityChat: { communityId: number; communityName: string | null };
  PostCommunity: undefined;
  SearchCommunity: undefined;
  SettingNavigator: NavigatorScreenParams<SettingStackParamList>;
};

export type MapStackParamList = {
  Map: undefined;
  SearchFarm: undefined;
  FarmDetail: { farmId: number };
};

export type FarmStackParamList = {
  FarmList: undefined;
  FarmCamera: { farmId: number; farmName: string | null };
  PostFarm: undefined;
  SettingNavigator: NavigatorScreenParams<SettingStackParamList>;
};

export type TalkStackParamList = {
  TalkList: undefined;
  TalkChat: { talkId: number; displayName: string | null | undefined };
  PostTalk: undefined;
  SearchTalk: undefined
  SettingNavigator: NavigatorScreenParams<SettingStackParamList>;
};

export type SettingStackParamList = {
  Setting: undefined;
  PostProfile: undefined;
};
