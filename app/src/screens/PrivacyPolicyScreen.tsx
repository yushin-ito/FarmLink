import React, { useCallback } from "react";

import PrivacyPolicyTemplate from "../components/templates/PrivacyPolicyTemplate";
import { RootStackScreenProps } from "../types";

const PrivacyPolicyScreen = ({ navigation }: RootStackScreenProps) => {
  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PrivacyPolicyTemplate goBackNavigationHandler={goBackNavigationHandler} />
  );
};

export default PrivacyPolicyScreen;
