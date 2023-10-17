import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";

import { AuthStackParamList } from "../types";
import WelcomeTemplate from "../components/templates/WelcomeTemplate";

type WelcomeNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Welcome"
>;

const WelcomeScreen = () => {
  const path = Linking.createURL("/");
  const navigation = useNavigation<WelcomeNavigationProp>();

  const signUpNavigationHandler = useCallback(() => {
    navigation.navigate("SignUp");
  }, []);

  const signInNavigationHandler = useCallback(() => {
    navigation.navigate("SignIn");
  }, []);

  return (
    <WelcomeTemplate
      path={path}
      signUpNavigationHandler={signUpNavigationHandler}
      signInNavigationHandler={signInNavigationHandler}
    />
  );
};

export default WelcomeScreen;
