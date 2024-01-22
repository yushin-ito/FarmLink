import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { supabase } from "../../../supabase";
import { Payment, UseMutationResult } from "../../../types";

export type SignUpToStripeResponse = Awaited<ReturnType<typeof signUpToStripe>>;
export type SignInToStripeResponse = Awaited<ReturnType<typeof signInToStripe>>;
export type PaymentByStripeResponse = Awaited<
  ReturnType<typeof paymentByStripe>
>;

const signUpToStripe = async (userId: string) => {
  const redirectUrl = Linking.createURL("/");

  const { data, error } = await supabase.functions.invoke("get-account-link", {
    body: { user_id: userId, redirect_url: redirectUrl },
  });

  if (error) {
    throw error;
  }

  await Linking.openURL(data.url);
};

const signInToStripe = async (stripeId: string) => {
  const { data, error } = await supabase.functions.invoke("get-login-link", {
    body: { account_id: stripeId },
  });

  if (error) {
    throw error;
  }

  await WebBrowser.openBrowserAsync(data.url);
};

const paymentByStripe = async ({
  type,
  stripeId,
}: {
  type: Payment;
  stripeId: string;
}) => {
  const { data, error } = await supabase.functions.invoke("get-payment-link", {
    body: { type: type, account_id: stripeId },
  });

  if (error) {
    throw error;
  }

  await WebBrowser.openBrowserAsync(data.url);
};

export const useSignUpToStripe = ({
  onSuccess,
  onError,
}: UseMutationResult<SignUpToStripeResponse, Error>) =>
  useMutation({
    mutationFn: signUpToStripe,
    onSuccess,
    onError,
  });

export const useSignInToStripe = ({
  onSuccess,
  onError,
}: UseMutationResult<SignInToStripeResponse, Error>) =>
  useMutation({
    mutationFn: signInToStripe,
    onSuccess,
    onError,
  });

export const usePaymentByStripe = ({
  onSuccess,
  onError,
}: UseMutationResult<PaymentByStripeResponse, Error>) =>
  useMutation({
    mutationFn: paymentByStripe,
    onSuccess,
    onError,
  });
