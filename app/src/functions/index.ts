import { IToastService } from "native-base/lib/typescript/components/composites/Toast";
import * as Linking from "expo-linking";
import { format, formatDistance } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { ReactNode } from "react";

export const wait = (sec: number) => {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

export const showAlert = (toast: IToastService, Alert: ReactNode) => {
  if (!toast.isActive(1)) {
    toast.show({
      id: 1,
      placement: "top",
      duration: 3000,
      render: () => Alert,
    });
  }
};

export const getSessionFromLink = (link: string) => {
  const { queryParams } = Linking.parse(link.replace("#", "?"));
  if (queryParams) {
    return {
      access_token: queryParams.access_token as string,
      refresh_token: queryParams.refresh_token as string,
    };
  }
  return null;
};

const getTimeDistanceJa = (date: string) => {
  const distance = formatDistance(new Date(), new Date(date), {
    locale: ja,
  });
  if (distance.indexOf("未満") !== -1) {
    return "たった今";
  } else if (distance.indexOf("か月") !== -1 || distance.indexOf("年") !== -1) {
    return format(new Date(date), "yyyy/M/d", {
      locale: ja,
    });
  } else {
    return distance.replace("約", "") + "前";
  }
};

const getTimeDistanceEn = (date: string) => {
  const distance = formatDistance(new Date(), new Date(date), {
    locale: enUS,
  });
  if (distance.indexOf("less") !== -1) {
    return "now";
  } else if (distance.indexOf("about") !== -1) {
    return distance.replace("about", "");
  }
  return distance;
};

export const getTimeDistance = (date: string, locale: "en" | "ja" | null) => {
  if (locale === "en") {
    return getTimeDistanceEn(date);
  } else if (locale === "ja") {
    return getTimeDistanceJa(date);
  } else {
    return getTimeDistanceEn(date);
  }
};

export type Category =
  | "all"
  | "joined"
  | "none"
  | "vegetable"
  | "fruit"
  | "fertilizer"
  | "disease";

export const getCategories = () => {
  const categories = [
    "none",
    "vegetable",
    "fruit",
    "fertilizer",
    "disease",
  ] as Category[];
  return categories;
};
