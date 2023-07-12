import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../types";
import { useSignUp } from "../hooks/auth/mutate";
import * as Linking from "expo-linking";
import SignUpTemplate from "../components/templates/SignUpTemplate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { usePostUser } from "../hooks/user/mutate";

type SignUpNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SignUp"
>;

const SignUpScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("auth");
  const navigation = useNavigation<SignUpNavigationProp>();

  const { mutateAsync: mutateAsyncSignUp, isLoading: isLoadingSignUp } =
    useSignUp({
      onSuccess: ({ user }) => {
        if (user && user.identities && user.identities?.length > 0) {
          mutateAsyncPostUser({
            userId: user.id,
            name: user.user_metadata.displayName,
            color: `hsl(${Math.floor(
              Math.random() * 360
            ).toString()}, 60%, 60%)`,
          });
          showAlert(
            toast,
            <Alert
              status="success"
              onPressCloseButton={() => toast.closeAll()}
              text={t("verifyEmail")}
            />
          );
        } else {
          showAlert(
            toast,
            <Alert
              status="error"
              onPressCloseButton={() => toast.closeAll()}
              text={t("alreadyExistAccount")}
            />
          );
        }
      },
      onError: (error) => {
        if (error.status === 429) {
          showAlert(
            toast,
            <Alert
              status="error"
              onPressCloseButton={() => toast.closeAll()}
              text={t("retryError")}
            />
          );
        } else {
          showAlert(
            toast,
            <Alert
              status="error"
              onPressCloseButton={() => toast.closeAll()}
              text={t("signupError")}
            />
          );
        }
      },
    });

  const { mutateAsync: mutateAsyncPostUser, isLoading: isLoadingPostUser } =
    usePostUser({
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      },
    });

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      const redirectURL = Linking.createURL("verify");
      await mutateAsyncSignUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectURL,
          data: { displayName },
        },
      });
    },
    []
  );

  const signInNavigationHandler = useCallback(() => {
    navigation.navigate("SignIn");
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SignUpTemplate
      isLoading={isLoadingSignUp || isLoadingPostUser}
      signUpWithEmail={signUpWithEmail}
      signInNavigationHandler={signInNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SignUpScreen;
