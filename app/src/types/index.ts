import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Database } from "./schema";

export type Locale = "en" | "ja";

export type Scene = "near" | "newest" | "popular";

export type Rate = "year" | "month" | "week" | "day" | "once";

export type Equipment = "water" | "parking" | "hut" | "tool";

export type Category =
  | "all"
  | "joining"
  | "none"
  | "veggie"
  | "fruit"
  | "compost"
  | "ill";

export type Region = {
  regionId: number;
  latitude: number;
  longitude: number;
};

export type UseQueryResult<T1, T2> = {
  onSuccess?: (response: T1) => void;
  onError?: (error: T2) => void;
};

export type UseMutationResult<T1, T2> = {
  onSuccess?: (response: T1) => void;
  onError?: (error: T2) => void;
};

export type User = Database["public"]["Tables"]["user"];
export type Chat = Database["public"]["Tables"]["chat"];
export type Community = Database["public"]["Tables"]["community"];
export type Farm = Database["public"]["Tables"]["farm"];
export type Talk = Database["public"]["Tables"]["talk"];
export type Rental = Database["public"]["Tables"]["rental"];
export type Like = Database["public"]["Tables"]["like"];
export type Device = Database["public"]["Tables"]["device"];
export type Notification = Database["public"]["Tables"]["notification"];

export type RootStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList> | undefined;
  TabNavigator: NavigatorScreenParams<TabParamList> | undefined;
  Walkthrough: undefined;
  ImagePreview: {
    title: string;
    imageUrl: string;
    chatId?: number;
    talkId?: number;
  };
  FarmDetail: { farmId: number };
  RentalDetail: { rentalId: number };
  EditFarm: { farmId: number };
  EditRental: { rentalId: number };
};

export type AuthStackParamList = {
  Welcome: undefined;
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
  Map: {
    regionId: number;
    latitude: number;
    longitude: number;
    type: "rental" | "farm";
  };
  SearchMap: { type: "rental" | "farm" };
  RentalGrid: undefined;
  RentalFilter: undefined;
  PostRental: undefined;
};

export type CommunityStackParamList = {
  CommunityList: undefined;
  CommunityChat: { communityId: number };
  PostCommunity: undefined;
  SearchCommunity: undefined;
};

export type FarmStackParamList = {
  FarmList: undefined;
  PostFarm: undefined;
};

export type TalkStackParamList = {
  TalkList: undefined;
  TalkChat: { talkId: number };
  PostTalk: undefined;
  SearchTalk: undefined;
};

export type SettingStackParamList = {
  Setting: undefined;
  RentalList: undefined;
  PostRental: undefined;
  PostProfile: undefined;
  LikeList: undefined;
  Transfer: undefined;
  Notification: undefined;
  Environment: undefined;
};

export type RootStackScreenProps = NativeStackScreenProps<RootStackParamList>;

export type AuthStackScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList>,
  NativeStackScreenProps<RootStackParamList>
>;

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
