import { useState, useCallback } from "react";
import { Platform } from "react-native";

import * as Notifications from "expo-notifications";

import { supabase } from "../../supabase";
import useAuth from "../auth/useAuth";

type UseNotificationType = {
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

type Notification = {
  to: string;
  title: string;
  body: string;
  data: object;
};

const useNotification = ({ onError, onDisable }: UseNotificationType) => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const postToken = useCallback(async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        onDisable && onDisable();
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync();

      if (session) {
        const { error } = await supabase
          .from("user")
          .upsert({ userId: session.user.id, token: token.data });
        if (error) {
          throw error;
        }
      }
      
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendNotification = useCallback(
    async ({ to, title, body, data }: Notification) => {
      setIsLoading(true);
      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to,
            title,
            body,
            data,
          }),
        });
      } catch (error) {
        if (error instanceof Error) {
          onError && onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    postToken,
    sendNotification,
    isLoading,
  };
};

export default useNotification;
