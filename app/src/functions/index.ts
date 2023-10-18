import { IToastService } from "native-base/lib/typescript/components/composites/Toast";
import { format, formatDistance } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { ReactNode } from "react";
import { Locale } from "../types";

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

export const getTimeDistance = (date: string, locale: Locale | null) => {
  if (locale === "en") {
    const distance = formatDistance(new Date(), new Date(date), {
      locale: enUS,
    });

    if (distance.indexOf("less") !== -1) {
      return "now";
    } else if (distance.indexOf("about") !== -1) {
      return distance.replace("about", "");
    } else {
      return distance;
    }
  } else if (locale === "ja") {
    const distance = formatDistance(new Date(), new Date(date), {
      locale: ja,
    });

    if (distance.indexOf("未満") !== -1) {
      return "たった今";
    } else if (
      distance.indexOf("か月") !== -1 ||
      distance.indexOf("年") !== -1
    ) {
      return format(new Date(date), "yyyy/M/d", {
        locale: ja,
      });
    } else {
      return distance.replace("約", "") + "前";
    }
  } else {
    const distance = formatDistance(new Date(), new Date(date), {
      locale: enUS,
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
