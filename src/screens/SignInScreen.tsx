import React, { useCallback } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import SignIn from "../components/templates/SignInTemplate";
import { showAlert } from "../functions";
import {
  useSignInWithEmail,
  useSignInWithProvider,
} from "../hooks/auth/mutate";
import { usePostUser, useSearchUser } from "../hooks/user/mutate";
import { AuthStackScreenProps } from "../types";

const SignInScreen = ({ navigation }: AuthStackScreenProps) => {
  const { t } = useTranslation("auth");
  const toast = useToast();

  const { mutateAsync: mutateAsyncSearchUser, isPending: isLoadingSearchUser } =
    useSearchUser({
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

  const { mutateAsync: mutateAsyncPostUser, isPending: isLoadingPostUser } =
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

  const {
    mutateAsync: mutateAsyncSignInWithEmail,
    isPending: isLoadingSignInWithEmail,
  } = useSignInWithEmail({
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

  const { mutateAsync: mutateAsyncSignInWithProvider } = useSignInWithProvider({
    onSuccess: async (data) => {
      if (data?.user) {
        const user = await mutateAsyncSearchUser(data?.user?.id);
        if (!user.length) {
          navigation.navigate("Walkthrough");
          mutateAsyncPostUser({
            userId: data.user.id,
            name: data.user.user_metadata?.name ?? t("user"),
            avatarUrl: data.user.user_metadata?.avatar_url?.replace(
              "_normal",
              ""
            ), // for Twitter
            color: `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`,
          });
        }
      }
    },
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

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      await mutateAsyncSignInWithEmail({ email, password });
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    await mutateAsyncSignInWithProvider("google");
  }, []);

  const signInWithApple = useCallback(async () => {
    await mutateAsyncSignInWithProvider("apple");
  }, []);

  const signInWithTwitter = useCallback(async () => {
    await mutateAsyncSignInWithProvider("twitter");
  }, []);

  const signInWithFacebook = useCallback(async () => {
    await mutateAsyncSignInWithProvider("facebook");
  }, []);

  const signUpNavigationHandler = useCallback(() => {
    navigation.navigate("SignUp");
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SignIn
      isLoading={
        isLoadingSignInWithEmail || isLoadingPostUser || isLoadingSearchUser
      }
      signInWithEmail={signInWithEmail}
      signInWithGoogle={signInWithGoogle}
      signInWithApple={signInWithApple}
      signInWithTwitter={signInWithTwitter}
      signInWithFacebook={signInWithFacebook}
      signUpNavigationHandler={signUpNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SignInScreen;
