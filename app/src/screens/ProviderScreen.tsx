import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../types";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { supabase } from "../supabase";
import { usePostUser } from "../hooks/user/mutate";
import ProviderTemplate from "../components/templates/ProviderTemplate";
import { useSignInWithProvider } from "../hooks/auth/mutate";

type SignUpNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "SignUp"
>;

const SignUpScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("auth");
  const navigation = useNavigation<SignUpNavigationProp>();

  const { mutateAsync: mutateAsyncPostUser } = usePostUser({
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("anyError")}
        />
      );
    },
  });

  const searchUser = useCallback(async (userId: string | undefined) => {
    const { data } = await supabase.from("user").select().eq("userId", userId);
    return data;
  }, []);

  const { mutateAsync: mutateAsyncSignInWithProvider } = useSignInWithProvider({
    onSuccess: async (data) => {
      if (data?.user && !(await searchUser(data.user.id))?.length) {
        mutateAsyncPostUser({
          userId: data.user.id,
          displayName: data.user.user_metadata.name,
          avatarUrl: data.user.user_metadata.avatar_url.replace("_normal", ""), // for Twitter
          introduction: t("notExistProfile"),
          hue: Math.floor(Math.random() * 360).toString(),
        });
      }
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("anyError")}
        />
      );
    },
  });

  const signInWithGoogle = useCallback(async () => {
    await mutateAsyncSignInWithProvider("google");
  }, []);

  const signInWithTwitter = useCallback(async () => {
    await mutateAsyncSignInWithProvider("twitter");
  }, []);

  const signInWithFacebook = useCallback(async () => {
    await mutateAsyncSignInWithProvider("facebook");
  }, []);

  const signInNavigationHandler = useCallback(() => {
    navigation.navigate("SignIn");
  }, []);

  return (
    <ProviderTemplate
      signInWithGoogle={signInWithGoogle}
      signInWithTwitter={signInWithTwitter}
      signInWithFacebook={signInWithFacebook}
      signInNavigationHandler={signInNavigationHandler}
    />
  );
};

export default SignUpScreen;
