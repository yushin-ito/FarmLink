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
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  const getAddress = useCallback(
    async (latitude: number, longitude: number) => {
      setIsLoadingAddress(true);
      const address = await Location.reverseGeocodeAsync({
        longitude,
        latitude,
      });
      setAddress(address[0]);
      setIsLoadingAddress(false);
    },
    []
  );

  const getCurrentPosition = useCallback(async () => {
    setIsLoadingPosition(true);
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
      setIsLoadingPosition(false);
    }
  }, []);

  return {
    position,
    address,
    getAddress,
    getCurrentPosition,
    isLoadingPosition,
    isLoadingAddress,
  };
};

export default useLocation;
