import React, { useCallback, useEffect, useState } from "react";
import EnvironmentTemplate from "../components/templates/EnvironmentTemplate";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { ColorSchemeName, NativeModules, Platform } from "react-native";
import { useColorMode } from "native-base";
import { Locale } from "../types";

const EnvironmentScreen = () => {
  const { i18n } = useTranslation("app");
  const navigation = useNavigation();
  const { setColorMode } = useColorMode();
  const [theme, setTheme] = useState<ColorSchemeName>(null);
  const [locale, setLocale] = useState<Locale | null>(null);

  const getEnvironment = useCallback(async () => {
    const locale = await AsyncStorage.getItem("@locale");
    setLocale(locale as Locale);
    const theme = await AsyncStorage.getItem("@theme");
    setTheme(theme as ColorSchemeName);
  }, []);

  useEffect(() => {
    getEnvironment();
  }, []);

  const changeLanguage = useCallback(async (language: Locale | null) => {
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
  }, []);

  const changeTheme = useCallback(async (theme: ColorSchemeName) => {
    if (theme) {
      await AsyncStorage.setItem("@theme", theme);
      setColorMode(theme);
      setTheme(theme);
    } else {
      await AsyncStorage.removeItem("@theme");
      setColorMode(null);
      setTheme(null);
    }
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EnvironmentTemplate
      goBackNavigationHandler={goBackNavigationHandler}
      locale={locale}
      theme={theme}
      changeLanguage={changeLanguage}
      changeTheme={changeTheme}
    />
  );
};

export default EnvironmentScreen;
