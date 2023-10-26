import React, { useCallback, useEffect, useState } from "react";
import { ColorSchemeName, NativeModules, Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useColorMode, useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import EnvironmentTemplate from "../components/templates/EnvironmentTemplate";
import { showAlert } from "../functions";
import { Locale } from "../types";

const EnvironmentScreen = () => {
  const { i18n, t } = useTranslation("app");
  const toast = useToast();
  const navigation = useNavigation();
  const { setColorMode } = useColorMode();
  
  const [theme, setTheme] = useState<ColorSchemeName>(null);
  const [locale, setLocale] = useState<Locale | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingChangeLanguage, setIsLoadingChangeLanguage] =
    useState<boolean>(false);
  const [isLoadingChangeTheme, setIsLoadingChangeTheme] =
    useState<boolean>(false);

  const getEnvironment = useCallback(async () => {
    setIsLoading(true);
    try {
      const locale = await AsyncStorage.getItem("@locale");
      setLocale(locale as Locale);
      const theme = await AsyncStorage.getItem("@theme");
      setTheme(theme as ColorSchemeName);
    } catch (error) {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getEnvironment();
  }, []);

  const changeLanguage = useCallback(async (language: Locale | null) => {
    setIsLoadingChangeLanguage(true);
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
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    } finally {
      setIsLoadingChangeLanguage(false);
    }
  }, []);

  const changeTheme = useCallback(async (theme: ColorSchemeName) => {
    setIsLoadingChangeTheme(true);
    try {
      if (theme) {
        await AsyncStorage.setItem("@theme", theme);
        setColorMode(theme);
        setTheme(theme);
      } else {
        await AsyncStorage.removeItem("@theme");
        setColorMode(null);
        setTheme(null);
      }
    } catch (error) {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    } finally {
      setIsLoadingChangeTheme(false);
    }
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EnvironmentTemplate
      locale={locale}
      theme={theme}
      changeLanguage={changeLanguage}
      changeTheme={changeTheme}
      isLoading={isLoading}
      isLoadingChangeLanguage={isLoadingChangeLanguage}
      isLoadingChangeTheme={isLoadingChangeTheme}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EnvironmentScreen;
