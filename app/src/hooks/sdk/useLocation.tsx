import { useState, useCallback, useEffect } from "react";
import * as Location from "expo-location";

type UseLocationType = {
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

const useLocation = ({ onError, onDisable }: UseLocationType) => {
  const [position, setPosition] = useState<Location.LocationObject>();
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        onDisable && onDisable();
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      setPosition(location);
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => await getCurrentPosition())();
  }, []);

  return { position, getCurrentPosition, isLoading };
};

export default useLocation;
