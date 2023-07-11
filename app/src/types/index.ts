import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList> | undefined;
  TabNavigator: NavigatorScreenParams<TabParamList> | undefined;
};

export type AuthStackParamList = {
  Provider: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  MapNavigator: NavigatorScreenParams<MapStackParamList>;
  CommunityNavigator: NavigatorScreenParams<CommunityStackParamList>;
  FarmNavigator: NavigatorScreenParams<FarmStackParamList>;
  TalkNavigator: NavigatorScreenParams<TalkStackParamList>;
  SettingNavigator: NavigatorScreenParams<SettingStackParamList>;
};

export type MapStackParamList = {
  Map: { latitude: number | null; longitude: number | null };
  SearchFarm: undefined;
  RentalDetail: { rentalId: number };
  FarmDetail: { farmId: number };
};

export type CommunityStackParamList = {
  CommunityList: undefined;
  CommunityChat: {
    communityId: number;
    communityName: string | null;
    category: string;
  };
  PostCommunity: undefined;
  SearchCommunity: { category: string };
};

export type FarmStackParamList = {
  FarmList: undefined;
  FarmDevice: { deviceId: string | null; farmName: string | null };
  PostFarm: undefined;
};

export type TalkStackParamList = {
  TalkList: undefined;
  TalkChat: { talkId: number; displayName: string | null | undefined };
  PostTalk: undefined;
  SearchTalk: undefined;
};

export type SettingStackParamList = {
  Setting: undefined;
  RentalList: undefined;
  PostRental: undefined;
  PostProfile: undefined;
};

export type MapStackScreenProps<Screen extends keyof MapStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MapStackParamList, Screen>,
    CompositeScreenProps<
      BottomTabScreenProps<TabParamList>,
      NativeStackScreenProps<RootStackParamList>
    >
  >;

export type CommunityStackScreenProps<
  Screen extends keyof CommunityStackParamList
> = CompositeScreenProps<
  BottomTabScreenProps<CommunityStackParamList, Screen>,
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type FarmStackScreenProps<Screen extends keyof FarmStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<FarmStackParamList, Screen>,
    CompositeScreenProps<
      BottomTabScreenProps<TabParamList>,
      NativeStackScreenProps<RootStackParamList>
    >
  >;

export type TalkStackScreenProps<Screen extends keyof TalkStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TalkStackParamList, Screen>,
    CompositeScreenProps<
      BottomTabScreenProps<TabParamList>,
      NativeStackScreenProps<RootStackParamList>
    >
  >;

export type SettingStackScreenProps<
  Screen extends keyof SettingStackParamList
> = CompositeScreenProps<
  BottomTabScreenProps<SettingStackParamList, Screen>,
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;
