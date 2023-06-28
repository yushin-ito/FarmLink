import { IToastService } from "native-base/lib/typescript/components/composites/Toast";
import * as Linking from "expo-linking";

export const showAlert = (
  toast: IToastService,
  Alert: React.ReactNode
) => {
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
