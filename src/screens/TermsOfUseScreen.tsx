import React, { useCallback } from "react";

import TermsOfUseTemplate from "../components/templates/TermsOfUseTemplate";
import { RootStackScreenProps } from "../types";

const TermsOfUseScreen = ({ navigation }: RootStackScreenProps) => {
  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <TermsOfUseTemplate goBackNavigationHandler={goBackNavigationHandler} />
  );
};

export default TermsOfUseScreen;
