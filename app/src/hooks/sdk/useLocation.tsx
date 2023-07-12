import { useState, useCallback } from "react";
import * as Location from "expo-location";
import { Platform } from "react-native";

type UseLocationType = {
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

export type Position = Location.LocationObject & {
  address: Location.LocationGeocodedAddress;
};

const useLocation = ({ onError, onDisable }: UseLocationType) => {
  const [position, setPosition] = useState<Position>();
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        onDisable && onDisable();
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy:
          Platform.OS === "android"
            ? Location.Accuracy.Low
            : Location.Accuracy.Lowest,
      });
      const address = await Location.reverseGeocodeAsync({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });

      setPosition({ ...location, address: address[0] });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { position, getCurrentPosition, isLoading };
};

export default useLocation;
