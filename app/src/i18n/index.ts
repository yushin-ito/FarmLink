import AsyncStorage from "@react-native-async-storage/async-storage";
import { locale } from "expo-localization";
import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ja from "./translations/ja.json";

export const resources = {
  en,
  ja,
} as const;

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    resources: (typeof resources)["en"];
  }
}

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  init: () => {},
  detect: async () => {
    const value = await AsyncStorage.getItem("@locale");
    if (value === "en") {
      return "en";
    } else if (value === "ja") {
      return "ja";
    }
    return locale;
  },
  cacheUserLanguage: async (lng) => {
    await AsyncStorage.setItem("@locale", lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: () => {
      if (locale === "en" || locale.startsWith("en-")) {
        return "en";
      } else if (locale === "ja" || locale.startsWith("ja-")) {
        return "ja";
      }
      return "en";
    },
    ns: ["common", "auth", "map", "chat", "community", "farm", "setting"],
    resources,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    returnNull: false,
    compatibilityJSON: "v3",
  });
