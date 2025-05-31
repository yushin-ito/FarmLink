import React, { useCallback } from "react";

import WelcomeTemplate from "../components/templates/WelcomeTemplate";
import { AuthStackScreenProps } from "../types";

const WelcomeScreen = ({ navigation }: AuthStackScreenProps) => {
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
