import React, { useCallback } from "react";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import WalkthroughTemplate from "../components/templates/WalkthroughTemplate";
import useAuth from "../hooks/auth/useAuth";
import { RootStackParamList } from "../types";

type WalkthroughNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Walkthrough"
>;

const WalkthroughScreen = () => {
  const navigation = useNavigation<WalkthroughNavigationProp>();
  const { session } = useAuth();

  const tabNavigatorNavigationHandler = useCallback(() => {
    navigation.push("TabNavigator");
  }, []);

  return (
    <WalkthroughTemplate
      verified={!!session?.user.id}
      tabNavigatorNavigationHandler={tabNavigatorNavigationHandler}
    />
  );
};

export default WalkthroughScreen;
