import AsyncStorage from "@react-native-async-storage/async-storage";
import { format as formatDate, formatDistance } from "date-fns";
import { ja as fnsJa, enUS as fnsEn } from "date-fns/locale";
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

const getTimeDistance = (value: string, lng: string | undefined) => {
  if (lng === "ja" || lng?.startsWith("ja-")) {
    const distance = formatDistance(new Date(), new Date(value), {
      locale: fnsJa,
    });

    if (distance.indexOf("未満") !== -1) {
      return "たった今";
    } else if (
      distance.indexOf("か月") !== -1 ||
      distance.indexOf("年") !== -1
    ) {
      return formatDate(new Date(value), "yyyy/M/d");
    } else {
      return distance.replace("約", "") + "前";
    }
  } else {
    const distance = formatDistance(new Date(), new Date(value), {
      locale: fnsEn,
    });

    if (distance.indexOf("less") !== -1) {
      return "now";
    } else if (distance.indexOf("about") !== -1) {
      return distance.replace("about", "");
    } else {
      return distance;
    }
  }
};

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
  cacheUserLanguage: () => {},
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
    ns: ["app", "auth", "map", "chat", "community", "farm", "setting", "crop"],
    resources,
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === "time") {
          return getTimeDistance(value, lng);
        }
        return value;
      },
    },
    react: {
      useSuspense: false,
    },
    returnNull: false,
    compatibilityJSON: "v3",
  });
