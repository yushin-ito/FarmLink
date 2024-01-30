import { useState, useCallback, useEffect } from "react";
import { Platform, NativeModules } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import { Locale } from "../../types";

type UseLocaleType = {
  onError?: (error: Error) => void;
};

const useLocale = ({ onError }: UseLocaleType) => {
  const { i18n } = useTranslation("app");

  const [locale, setLocale] = useState<Locale | null>(null);
  const [isLoadingLocale, setIsLoadingLocale] = useState<boolean>(false);
  const [isLoadingChangeLocale, setIsLoadingChangeLocale] =
    useState<boolean>(false);

  const getLocale = useCallback(async () => {
    setIsLoadingLocale(true);
    try {
      const locale = await AsyncStorage.getItem("@locale");
      setLocale(locale as Locale);
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoadingLocale(false);
    }
  }, []);

  useEffect(() => {
    getLocale();
  }, []);

  const changeLocale = useCallback(async (language: Locale | null) => {
    setIsLoadingChangeLocale(true);
    try {
      if (language) {
        await AsyncStorage.setItem("@locale", language);
        i18n.changeLanguage(language);
        setLocale(language);
      } else {
        await AsyncStorage.removeItem("@locale");
        const locale =
          Platform.OS === "ios"
            ? NativeModules.SettingsManager.settings.AppleLocale
            : NativeModules.I18nManager.localeIdentifier;
        i18n.changeLanguage(locale.substring(0, locale.indexOf("_")));
        setLocale(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoadingChangeLocale(false);
    }
  }, []);

  return { locale, changeLocale, isLoadingLocale, isLoadingChangeLocale };
};
export default useLocale;
