import { useState, useCallback } from "react";
import * as Location from "expo-location";
import { Platform } from "react-native";

type UseLocationType = {
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

const useLocation = ({ onError, onDisable }: UseLocationType) => {
  const [position, setPosition] = useState<Location.LocationObject>();
  const [address, setAddress] = useState<Location.LocationGeocodedAddress>();
  const [isLoading, setIsLoading] = useState(false);

  const getAddress = useCallback(
    async (latitude: number, longitude: number) => {
      const address = await Location.reverseGeocodeAsync({
        longitude,
        latitude,
      });
      setAddress(address[0]);
    },
    []
  );

  const getCurrentPosition = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        onDisable && onDisable();
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy:
          Platform.OS === "android"
            ? Location.Accuracy.Low
            : Location.Accuracy.Lowest,
      });

      setPosition(position);
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { position, address, getAddress, getCurrentPosition, isLoading };
};

export default useLocation;
