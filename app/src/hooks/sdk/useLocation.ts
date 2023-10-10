import { useState, useCallback } from "react";
import * as Location from "expo-location";

type UseLocationType = {
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

const useLocation = ({ onError, onDisable }: UseLocationType) => {
  const [position, setPosition] = useState<Location.LocationObject>();
  const [address, setAddress] = useState<Location.LocationGeocodedAddress>();
  const [geocode, setGeocode] = useState<Location.LocationGeocodedLocation>();
  const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  const getGeocode = useCallback(async (address: string) => {
    setIsLoadingGeocode(true);
    const geocode = await Location.geocodeAsync(address);
    setGeocode(geocode[0]);
    setIsLoadingGeocode(false);
  }, []);

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
        accuracy: Location.Accuracy.Lowest,
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
    geocode,
    getAddress,
    getGeocode,
    getCurrentPosition,
    isLoadingPosition,
    isLoadingAddress,
    isLoadingGeocode,
  };
};

export default useLocation;
