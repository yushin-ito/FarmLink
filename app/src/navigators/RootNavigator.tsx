import React, { useEffect } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Center, Spinner, useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import { showAlert } from "../functions";
import useAuth from "../hooks/auth/useAuth";
import useNotification from "../hooks/sdk/useNotification";
import EditFarmScreen from "../screens/EditFarmScreen";
import EditRecordScreen from "../screens/EditRecordScreen";
import EditRentalScreen from "../screens/EditRentalScreen";
import FarmDetailScreen from "../screens/FarmDetailScreen";
import ImagePreviewScreen from "../screens/ImagePreviewScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import RentalDetailScreen from "../screens/RentalDetailScreen";
import TermsOfUseScreen from "../screens/TermsOfUseScreen";
import WalkthroughScreen from "../screens/WalkthroughScreen";
import { RootStackParamList } from "../types";

import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { t } = useTranslation("app");
  const toast = useToast();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (session) {
      postToken();
    }
  }, [session]);

  const { postToken } = useNotification({
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestNoti")}
        />
      );
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

  if (isLoading) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {session && session?.user.id ? (
        <RootStack.Group>
          <RootStack.Screen name="TabNavigator" component={TabNavigator} />
          <RootStack.Group screenOptions={{ gestureEnabled: false }}>
            <RootStack.Screen
              name="Walkthrough"
              component={WalkthroughScreen}
            />
            <RootStack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
            <RootStack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
            />
            <RootStack.Screen
              name="RentalDetail"
              component={RentalDetailScreen}
            />
            <RootStack.Screen name="FarmDetail" component={FarmDetailScreen} />
          </RootStack.Group>
          <RootStack.Group>
            <RootStack.Screen
              name="ImagePreview"
              component={ImagePreviewScreen}
            />
          </RootStack.Group>
          <RootStack.Group
            screenOptions={{
              animation: "fade_from_bottom",
              animationDuration: 150,
            }}
          >
            <RootStack.Screen name="EditRental" component={EditRentalScreen} />
            <RootStack.Screen name="EditFarm" component={EditFarmScreen} />
            <RootStack.Screen name="EditRecord" component={EditRecordScreen} />
          </RootStack.Group>
        </RootStack.Group>
      ) : (
        <RootStack.Screen name="AuthNavigator" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
