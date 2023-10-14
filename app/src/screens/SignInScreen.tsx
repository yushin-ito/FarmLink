import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../types";
import {
  useSignInWithEmail,
  useSignInWithProvider,
} from "../hooks/auth/mutate";
import SignIn from "../components/templates/SignInTemplate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { usePostUser } from "../hooks/user/mutate";
import { supabase } from "../supabase";

type SignInNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SignIn"
>;

const SignInScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("auth");
  const navigation = useNavigation<SignInNavigationProp>();

  const searchUser = useCallback(async (userId: string) => {
    const { data } = await supabase.from("user").select().eq("userId", userId);
    return data;
  }, []);

  const {
    mutateAsync: mutateAsyncSignInWithEmail,
    isLoading: isLoadingSignInWithEmail,
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

  const { mutateAsync: mutateAsyncPostUser } = usePostUser({
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
      if (data?.user && !(await searchUser(data.user.id))?.length) {
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

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      await mutateAsyncSignInWithEmail({ email, password });
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    await mutateAsyncSignInWithProvider("google");
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
      isLoading={isLoadingSignInWithEmail}
      signInWithEmail={signInWithEmail}
      signInWithGoogle={signInWithGoogle}
      signInWithTwitter={signInWithTwitter}
      signInWithFacebook={signInWithFacebook}
      signUpNavigationHandler={signUpNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SignInScreen;
