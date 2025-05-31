import { useState, useRef, useEffect } from "react";
import { Appearance } from "react-native";

const useColorScheme = (delay = 250) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(onColorSchemeChange);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      subscription.remove();
    };
  }, []);

  const onColorSchemeChange = (
    preferences: Appearance.AppearancePreferences
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setColorScheme(preferences.colorScheme);
    }, delay);
  };

  return colorScheme;
};

export default useColorScheme;
