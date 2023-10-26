import React, { useCallback } from "react";
import { createContext, ReactNode, useEffect, useState } from "react";

import { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";

import { supabase } from "../supabase";

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

  const getCurrentSession = useCallback(async () => {
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

  const setCurrentSession = useCallback(async (session: CurrentSession) => {
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

  const getSessionByLink = useCallback((link: string) => {
    const { queryParams } = Linking.parse(link.replace("#", "?"));
    if (queryParams) {
      return {
        access_token: queryParams.access_token as string,
        refresh_token: queryParams.refresh_token as string,
      };
    }
    return null;
  }, []);

  useEffect(() => {
    getCurrentSession();

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
  }, []);

  useEffect(() => {
    (async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const session = getSessionByLink(url);

        if (session?.access_token && session?.refresh_token) {
          setCurrentSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
        }
      }
    })();

    const subscription = Linking.addEventListener("url", async (res) => {
      const session = getSessionByLink(res.url);

      if (session?.access_token && session?.refresh_token) {
        setCurrentSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, error, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
