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
  DMNavigator: undefined;
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
};

export type FarmStackParamList = {
  FarmList: undefined;
  FarmCamera: { farmId: number; farmName: string | null };
  PostFarm: undefined;
  SettingNavigator: NavigatorScreenParams<SettingStackParamList>;
};

export type DMStackParamList = {
  DMList: undefined;
  DMChat: { dmId: number; dmName: string | null };
  PostDM: undefined;
  SettingNavigator: NavigatorScreenParams<SettingStackParamList>;
};

export type SettingStackParamList = {
  Setting: undefined;
  PostProfile: undefined;
};
