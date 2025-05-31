import React, { useCallback } from "react";

import TermsListTemplate from "../components/templates/TermsListTemplate";
import { SettingStackScreenProps } from "../types";

const TermsListScreen = ({
  navigation,
}: SettingStackScreenProps<"TermsList">) => {
  const termsOfUseNavigationHandler = useCallback(() => {
    navigation.navigate("TermsOfUse");
  }, []);

  const privacyPolicyNavigationHandler = useCallback(() => {
    navigation.navigate("PrivacyPolicy");
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <TermsListTemplate
      termsOfUseNavigationHandler={termsOfUseNavigationHandler}
      privacyPolicyNavigationHandler={privacyPolicyNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default TermsListScreen;
