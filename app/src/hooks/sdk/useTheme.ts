import { useState, useCallback, useEffect } from "react";
import { ColorSchemeName } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorMode } from "native-base";

type UseThemeType = {
  onError?: (error: Error) => void;
};

const useTheme = ({ onError }: UseThemeType) => {
  const { setColorMode } = useColorMode();

  const [theme, setTheme] = useState<ColorSchemeName>(null);
  const [isLoadingTheme, setIsLoadingTheme] = useState<boolean>(false);
  const [isLoadingChangeTheme, setIsLoadingChangeTheme] =
    useState<boolean>(false);

  const getTheme = useCallback(async () => {
    setIsLoadingTheme(true);
    try {
      const theme = await AsyncStorage.getItem("@theme");
      setTheme(theme as ColorSchemeName);
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoadingTheme(false);
    }
  }, []);

  useEffect(() => {
    getTheme();
  }, []);

  const changeTheme = useCallback(async (theme: ColorSchemeName) => {
    setIsLoadingChangeTheme(true);
    try {
      if (theme) {
        await AsyncStorage.setItem("@theme", theme);
        setColorMode(theme);
        setTheme(theme);
      } else {
        await AsyncStorage.removeItem("@theme");
        setColorMode(null);
        setTheme(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoadingChangeTheme(false);
    }
  }, []);

  return { theme, changeTheme, isLoadingTheme, isLoadingChangeTheme };
};
export default useTheme;
