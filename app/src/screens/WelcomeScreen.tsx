import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../types";
import WelcomeTemplate from "../components/templates/WelcomeTemplate";

type WelcomeNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Welcome"
>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeNavigationProp>();

  const signUpNavigationHandler = useCallback(() => {
    navigation.navigate("SignUp");
  }, []);

  const signInNavigationHandler = useCallback(() => {
    navigation.navigate("SignIn");
  }, []);

  return (
    <WelcomeTemplate
      signUpNavigationHandler={signUpNavigationHandler}
      signInNavigationHandler={signInNavigationHandler}
    />
  );
};

export default WelcomeScreen;
