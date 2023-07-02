import React, { useCallback } from "react";
import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../supabase";

import { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { getSessionFromLink } from "../functions";

type AuthContextProps = {
  session: Session | null;
  error: Error | undefined;
  isLoading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

type CurrentSession = {
  access_token: string;
  refresh_token: string;
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  const getSessionFromDB = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setSession(data.session);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    }
  }, []);

  const setSessionToDB = useCallback(async (session: CurrentSession) => {
    try {
      const { error } = await supabase.auth.setSession(session);
      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    }
  }, []);

  useEffect(() => {
    getSessionFromDB();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
      } else {
        setSession(null);
      }

      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [getSessionFromDB]);

  useEffect(() => {
    (async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const session = getSessionFromLink(url);

        if (session?.access_token && session?.refresh_token) {
          setSessionToDB({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
        }
      }
    })();

    const subscription = Linking.addEventListener("url", async (res) => {
      const session = getSessionFromLink(res.url);

      if (session?.access_token && session?.refresh_token) {
        setSessionToDB({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [setSessionToDB]);

  return (
    <AuthContext.Provider value={{ session, error, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};