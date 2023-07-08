import { IToastService } from "native-base/lib/typescript/components/composites/Toast";
import * as Linking from "expo-linking";
import { formatDistance } from "date-fns";
import { ja, enUS } from "date-fns/locale";

export const showAlert = (toast: IToastService, Alert: React.ReactNode) => {
  if (!toast.isActive(1)) {
    toast.show({
      id: 1,
      placement: "top",
      duration: 10000,
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

export const getTimeDistance = (date: string, locale: string | null) => {
  const localeJP = locale === "ja" || locale?.startsWith("ja-");
  const distance = formatDistance(new Date(), new Date(date), {
    locale: localeJP ? ja : enUS,
  });

  return distance;
};

export type Category =
  | "all"
  | "none"
  | "vegetable"
  | "fruit"
  | "fertilizer"
  | "disease";

export const getCategories = () => {
  const categories = ["none", "vegetable", "fruit", "fertilizer", "disease"];
  return categories;
};
