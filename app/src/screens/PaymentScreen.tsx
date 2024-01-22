import React, { useCallback } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PaymentTemplate from "../components/templates/PaymentTemplate";
import { showAlert } from "../functions";
import {
  usePaymentByStripe,
  useSignInToStripe,
  useSignUpToStripe,
} from "../hooks/payment/mutate";
import { useQueryUser } from "../hooks/user/query";
import { SettingStackScreenProps } from "../types";

const PaymentScreen = ({ navigation }: SettingStackScreenProps<"Payment">) => {
  const { t } = useTranslation("setting");
  const toast = useToast();

  const { data: user } = useQueryUser();

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
    mutateAsync: mutatePaymentByStripe,
    isPending: isLoadingPaymentByStripe,
  } = usePaymentByStripe({
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

  const signUpToStripe = useCallback(async () => {
    if (user?.userId) {
      await mutateSignUpToStripe(user.userId);
    }
  }, [user]);

  const signInToStripe = useCallback(async () => {
    if (user?.stripeId) {
      await mutateSignInToStripe(user.stripeId);
    }
  }, [user]);

  const subscribeToApp = useCallback(async () => {
    if (user?.stripeId) {
      await mutatePaymentByStripe({
        type: "subscription",
        stripeId: user.stripeId,
      });
    }
  }, [user]);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PaymentTemplate
      user={user}
      signUpToStripe={signUpToStripe}
      signInToStripe={signInToStripe}
      subscribeToApp={subscribeToApp}
      isLoading={
        isLoadingSignUpToStripe ||
        isLoadingSignInToStripe ||
        isLoadingPaymentByStripe
      }
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PaymentScreen;
