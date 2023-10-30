import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react";

import * as Splash from "expo-splash-screen";

import SplashTemplate from "../components/templates/SplashTemplate";
import { wait } from "../functions";

type SplashScreenProps = {
  setIsReady: Dispatch<SetStateAction<boolean>>;
};

const SplashScreen = ({ setIsReady }: SplashScreenProps) => {
  const prefetch = useCallback(async () => {}, []);

  useEffect(() => {
    prefetch();
  }, []);

  const onLayout = useCallback(async () => {
    await Splash.hideAsync();
    await wait(3);
    setIsReady(true);
  }, []);

  return <SplashTemplate onLayout={onLayout} />;
};

export default SplashScreen;
