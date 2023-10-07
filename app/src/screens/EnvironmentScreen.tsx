import React, { useCallback, useEffect, useState } from "react";
import EnvironmentTemplate from "../components/templates/EnvironmentTemplate";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { ColorSchemeName, useColorScheme } from "react-native";
import { useColorMode } from "native-base";

type Locale = "ja" | "en" | null;

const EnvironmentScreen = () => {
  const { i18n } = useTranslation("common");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { setColorMode } = useColorMode();
  const [theme, setTheme] = useState<ColorSchemeName>(null);
  const [locale, setLocale] = useState<Locale>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getEnvironment = useCallback(async () => {
    const locale = await AsyncStorage.getItem("@locale");
    setLocale(locale as Locale);
    const theme = await AsyncStorage.getItem("@theme");
    console.log(theme);
    setTheme(theme as ColorSchemeName);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getEnvironment();
    setIsLoading(false);
  }, []);

  const changeLanguage = useCallback(async (language: Locale) => {
    if (language) {
      await AsyncStorage.setItem("@locale", language);
      i18n.changeLanguage(language);
      setLocale(language);
    } else {
      await AsyncStorage.removeItem("@locale");
      setLocale(null);
    }
  }, []);

  const changeTheme = useCallback(
    async (theme: ColorSchemeName) => {
      if (theme) {
        await AsyncStorage.setItem("@theme", theme);
        setColorMode(theme);
        setTheme(theme);
      } else {
        await AsyncStorage.removeItem("@theme");
        setColorMode(colorScheme);
        setTheme(null);
      }
    },
    [colorScheme]
  );

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
      isLoading={isLoading}
    />
  );
};

export default EnvironmentScreen;
