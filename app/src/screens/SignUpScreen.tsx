import React, { useCallback } from "react";
import { useSignInWithProvider, useSignUp } from "../hooks/auth/mutate";
import * as Linking from "expo-linking";
import SignUpTemplate from "../components/templates/SignUpTemplate";
import { showAlert, wait } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { usePostUser, useSearchUser } from "../hooks/user/mutate";
import { AuthStackScreenProps } from "../types";

const SignUpScreen = ({ navigation }: AuthStackScreenProps) => {
  const toast = useToast();
  const { t } = useTranslation("auth");

  const { mutateAsync: mutateAsyncSearchUser, isLoading: isLoadingSearchUser } =
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

  const {
    mutateAsync: mutateAsyncSignUpWithEmail,
    isLoading: isLoadingSignUpWithEmail,
  } = useSignUp({
    onSuccess: async({ user }) => {
      if (user && user.identities && user.identities?.length > 0) {
        navigation.navigate("Walkthrough");
        await wait(0.1);
        mutateAsyncPostUser({
          userId: user.id,
          name: user.user_metadata.displayName,
          color: `hsl(${Math.floor(Math.random() * 360).toString()}, 60%, 60%)`,
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

  const { mutateAsync: mutateAsyncSignInWithProvider } = useSignInWithProvider({
    onSuccess: async (data) => {
      const user = await mutateAsyncSearchUser(data?.user?.id);
      if (data?.user && !user) {
        navigation.navigate("Walkthrough");
        await wait(0.1);
        mutateAsyncPostUser({
          userId: data.user.id,
          name: data.user.user_metadata.name,
          avatarUrl: data.user.user_metadata.avatar_url.replace("_normal", ""), // for Twitter
          color: `hsl(${Math.floor(Math.random() * 360).toString()}, 60%, 60%)`,
        });
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
    async (email: string, password: string, displayName: string) => {
      const redirectURL = Linking.createURL("verify");
      await mutateAsyncSignUpWithEmail({
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

  const signUpWithGoogle = useCallback(async () => {
    await mutateAsyncSignInWithProvider("google");
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
      signUpWithTwitter={signUpWithTwitter}
      signUpWithFacebook={signUpWithFacebook}
      signInNavigationHandler={signInNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SignUpScreen;
