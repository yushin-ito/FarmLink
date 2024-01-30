import React, { useCallback } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import EnvironmentTemplate from "../components/templates/EnvironmentTemplate";
import { showAlert } from "../functions";
import useLocale from "../hooks/sdk/useLocale";
import useTheme from "../hooks/sdk/useTheme";
import { SettingStackScreenProps } from "../types";

const EnvironmentScreen = ({
  navigation,
}: SettingStackScreenProps<"Environment">) => {
  const { t } = useTranslation("app");
  const toast = useToast();

  const { locale, changeLocale, isLoadingLocale, isLoadingChangeLocale } =
    useLocale({
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      },
    });

  const { theme, changeTheme, isLoadingTheme, isLoadingChangeTheme } = useTheme(
    {
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      },
    }
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EnvironmentTemplate
      locale={locale}
      theme={theme}
      changeLocale={changeLocale}
      changeTheme={changeTheme}
      isLoading={isLoadingLocale || isLoadingTheme}
      isLoadingChangeLocale={isLoadingChangeLocale}
      isLoadingChangeTheme={isLoadingChangeTheme}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EnvironmentScreen;
