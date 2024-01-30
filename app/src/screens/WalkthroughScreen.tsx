import React, { useCallback } from "react";

import WalkthroughTemplate from "../components/templates/WalkthroughTemplate";
import useAuth from "../hooks/auth/useAuth";
import { RootStackScreenProps } from "../types";

const WalkthroughScreen = ({ navigation }: RootStackScreenProps) => {
  const { session } = useAuth();

  const tabNavigatorNavigationHandler = useCallback(() => {
    navigation.push("TabNavigator");
  }, []);

  return (
    <WalkthroughTemplate
      verified={!!session?.user.id}
      tabNavigatorNavigationHandler={tabNavigatorNavigationHandler}
    />
  );
};

export default WalkthroughScreen;
