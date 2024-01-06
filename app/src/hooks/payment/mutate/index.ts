import { useMutation } from "@tanstack/react-query";
import * as Liking from "expo-linking";

import { supabase } from "../../../supabase";
import { UseMutationResult } from "../../../types";

export type SignUpToStripeResponse = Awaited<ReturnType<typeof signUpToStripe>>;
export type SignInToStripeResponse = Awaited<ReturnType<typeof signInToStripe>>;
export type DestinationPaymentResponse = Awaited<
  ReturnType<typeof destinationPayment>
>;

const signUpToStripe = async (userId: string) => {
  const redirectUrl = Liking.createURL("/redirect");

  const { data, error } = await supabase.functions.invoke("get-account-link", {
    body: { user_id: userId, redirect_url: redirectUrl },
  });

  if (error) {
    throw error;
  }

  Liking.openURL(data.url);
};

const signInToStripe = async (stripeId: string) => {
  const { data, error } = await supabase.functions.invoke("get-login-link", {
    body: { account_id: stripeId },
  });

  if (error) {
    throw error;
  }

  Liking.openURL(data.url);
};

const destinationPayment = async (stripeId: string) => {
  const { data, error } = await supabase.functions.invoke("get-payment-link", {
    body: { account_id: stripeId },
  });

  if (error) {
    throw error;
  }

  Liking.openURL(data.url);
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

export const useDestinationPayment = ({
  onSuccess,
  onError,
}: UseMutationResult<DestinationPaymentResponse, Error>) =>
  useMutation({
    mutationFn: destinationPayment,
    onSuccess,
    onError,
  });
