import {
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials,
  AuthError,
} from "@supabase/supabase-js";
import { supabase, supabaseUrl } from "../../../supabase";
import { useMutation } from "react-query";
import { UseMutationResult } from "../../../types";
import { makeRedirectUri, startAsync } from "expo-auth-session";

export type SignUpResponse = Awaited<ReturnType<typeof signUp>>;
export type SignInWithEmailResponse = Awaited<
  ReturnType<typeof signInWithEmail>
>;
export type SignInWithProviderResponse = Awaited<
  ReturnType<typeof signInWithProvider>
>;
export type SignOutResponse = Awaited<ReturnType<typeof signOut>>;

const signUp = async (credentials: SignUpWithPasswordCredentials) => {
  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) {
    throw error;
  }
  return data;
};

const signInWithEmail = async (credentials: SignInWithPasswordCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    throw error;
  }
  return data;
};

const signInWithProvider = async (provider: string) => {
  const redirectUrl = makeRedirectUri({
    path: "verify",
  });

  const authResponse = await startAsync({
    authUrl: `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUrl}`,
    returnUrl: redirectUrl,
  });

  if (authResponse.type === "success") {
    const { data, error } = await supabase.auth.setSession({
      access_token: authResponse.params.access_token,
      refresh_token: authResponse.params.refresh_token,
    });
    if (error) {
      throw error;
    }
    return data;
  } else if (authResponse.type === "error") {
    throw authResponse.error;
  } else {
    return null;
  }
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export const useSignUp = ({
  onSuccess,
  onError,
}: UseMutationResult<SignUpResponse, AuthError>) =>
  useMutation({
    mutationFn: signUp,
    onSuccess,
    onError,
  });

export const useSignInWithEmail = ({
  onSuccess,
  onError,
}: UseMutationResult<SignInWithEmailResponse, AuthError>) =>
  useMutation({
    mutationFn: signInWithEmail,
    onSuccess,
    onError,
  });

export const useSignInWithProvider = ({
  onSuccess,
  onError,
}: UseMutationResult<SignInWithProviderResponse, Error>) =>
  useMutation({
    mutationFn: signInWithProvider,
    onSuccess,
    onError,
  });

export const useSignOut = ({
  onSuccess,
  onError,
}: UseMutationResult<SignOutResponse, AuthError>) =>
  useMutation({
    mutationFn: signOut,
    onSuccess,
    onError,
  });
