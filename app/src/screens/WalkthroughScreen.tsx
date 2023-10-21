import React, { useCallback } from "react";
import WalkthroughTemplate from "../components/templates/WalkthroughTemplate";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/auth/useAuth";

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
