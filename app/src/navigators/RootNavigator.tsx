import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import useAuth from "../hooks/auth/useAuth";
import TabBarNavigator from "./TabBarNavigator";
import AuthNavigator from "./AuthNavigator";
import { Center, Spinner, useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";

import { RootStackParamList } from "../types";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { t } = useTranslation("auth");
  const toast = useToast();
  const { session, isLoading, error } = useAuth();

  if (isLoading) {
    if (error) {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("signupError")}
        />
      );
    }

    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {session && session?.user.id ? (
        <RootStack.Screen name="TabBarNavigator" component={TabBarNavigator} />
      ) : (
        <RootStack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
