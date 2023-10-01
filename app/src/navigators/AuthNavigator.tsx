import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../types/index";
import ProviderScreen from "../screens/ProviderScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Provider" component={ProviderScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
