import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../types";
import { useSignInWithEmail } from "../hooks/auth/mutate";
import SignInTemplate from "../components/templates/SignInTemplate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";

type SignInNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SignIn"
>;

const SignInScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("auth");
  const navigation = useNavigation<SignInNavigationProp>();

  const { mutateAsync, isLoading } = useSignInWithEmail({
    onError: (error) => {
      if (error.status == 400) {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("invalidCredentials")}
          />
        );
      } else {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("signinError")}
          />
        );
      }
    },
  });

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      await mutateAsync({ email, password });
    },
    []
  );

  const signUpNavigationHandler = useCallback(() => {
    navigation.navigate("SignUp");
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SignInTemplate
      isLoading={isLoading}
      signInWithEmail={signInWithEmail}
      signUpNavigationHandler={signUpNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SignInScreen;
