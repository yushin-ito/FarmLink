import React, { useCallback, useEffect } from "react";

import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { Button, Center, useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import { showAlert } from "../functions";
import {
  useDestinationPayment,
  useSignInToStripe,
  useSignUpToStripe,
} from "../hooks/payment/mutate";
import { useQueryPaymentSheetParams } from "../hooks/payment/query";
import { useQueryUser } from "../hooks/user/query";

const Transfer = () => {
  const publishableKey = Constants.expoConfig?.extra?.STRIPE_KEY_LIVE;

  const { t } = useTranslation("setting");
  const toast = useToast();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const { data: paymentSheetParams, isLoading: isLoadingParams } =
    useQueryPaymentSheetParams(user?.stripeId, 1000);

  const {
    mutateAsync: mutateSignUpToStripe,
    isPending: isLoadingSignUpToStripe,
  } = useSignUpToStripe({
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
    mutateAsync: mutateSignInToStripe,
    isPending: isLoadingSignInToStripe,
  } = useSignInToStripe({
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
    mutateAsync: mutateDestinationPayment,
    isPending: isLoadingDestinationPayment,
  } = useDestinationPayment({
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

  const openPaymentSheet = useCallback(async () => {
    const { error } = await presentPaymentSheet();
    console.log(error);
  }, [paymentSheetParams, user]);

  const initPaymentSheet1 = useCallback(async () => {
    console.log(paymentSheetParams);
    if (paymentSheetParams && user) {
      const { error } = await initPaymentSheet({
        merchantDisplayName: "FarmLink",
        customerId: paymentSheetParams.customer,
        customerEphemeralKeySecret: paymentSheetParams.ephemeralKey,
        paymentIntentClientSecret: paymentSheetParams.paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: user.name,
        },
      });
      console.log(error);
    }
  }, [paymentSheetParams, user]);

  useEffect(() => {
    initPaymentSheet1();
    // user && mutateSignUpToStripe(user.userId);
    user?.stripeId && mutateDestinationPayment(user.stripeId);
  }, [paymentSheetParams, user]);

  return (
    <StripeProvider
      urlScheme="farmlink"
      merchantIdentifier="merchant.com.farmlink.app"
      publishableKey={publishableKey}
    >
      <Center flex={1}>
        <Button onPress={openPaymentSheet} />
      </Center>
    </StripeProvider>
  );
};

export default Transfer;
