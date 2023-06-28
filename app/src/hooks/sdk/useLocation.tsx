import { useState, useCallback } from "react";
import * as Location from "expo-location";

type UseLocationType = {
  onSuccess?: (location: Location.LocationObject) => void;
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

const useLocation = ({ onSuccess, onError, onDisable }: UseLocationType) => {
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
      onSuccess && onSuccess(location);
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getCurrentPosition, isLoading };
};

export default useLocation;
