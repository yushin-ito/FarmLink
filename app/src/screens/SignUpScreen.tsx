import React, { useCallback } from "react";

import * as Linking from "expo-linking";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import SignUpTemplate from "../components/templates/SignUpTemplate";
import { showAlert } from "../functions";
import {
  useSignInWithProvider,
  useSignUpWithEmail,
} from "../hooks/auth/mutate";
import { usePostUser, useSearchUser } from "../hooks/user/mutate";
import { AuthStackScreenProps } from "../types";

const SignUpScreen = ({ navigation }: AuthStackScreenProps) => {
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
    mutateAsync: mutateAsyncSignUpWithEmail,
    isPending: isLoadingSignUpWithEmail,
  } = useSignUpWithEmail({
    onSuccess: async ({ user }) => {
      if (user && user.identities && user.identities.length > 0) {
        navigation.navigate("Walkthrough");
        mutateAsyncPostUser({
          userId: user.id,
          name: t("user"),
          color: `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`,
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

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      const redirectURL = Linking.createURL("redirect");
      await mutateAsyncSignUpWithEmail({
        email,
        password,
        options: {
          emailRedirectTo: redirectURL,
        },
      });
    },
    []
  );

  const signUpWithGoogle = useCallback(async () => {
    await mutateAsyncSignInWithProvider("google");
  }, []);

  const signUpWithApple = useCallback(async () => {
    await mutateAsyncSignInWithProvider("apple");
  }, []);

  const signUpWithTwitter = useCallback(async () => {
    await mutateAsyncSignInWithProvider("twitter");
  }, []);

  const signUpWithFacebook = useCallback(async () => {
    await mutateAsyncSignInWithProvider("facebook");
  }, []);

  const signInNavigationHandler = useCallback(() => {
    navigation.navigate("SignIn");
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SignUpTemplate
      isLoading={
        isLoadingSignUpWithEmail || isLoadingPostUser || isLoadingSearchUser
      }
      signUpWithEmail={signUpWithEmail}
      signUpWithGoogle={signUpWithGoogle}
      signUpWithApple={signUpWithApple}
      signUpWithTwitter={signUpWithTwitter}
      signUpWithFacebook={signUpWithFacebook}
      signInNavigationHandler={signInNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SignUpScreen;
