import { useState, useCallback } from "react";
import * as Location from "expo-location";
import { LatLng } from "react-native-maps";
import { Platform } from "react-native";

type UseLocationType = {
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

const useLocation = ({ onError, onDisable }: UseLocationType) => {
  const [position, setPosition] = useState<LatLng>();
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

  const getPosition = useCallback(async () => {
    setIsLoadingPosition(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        onDisable && onDisable();
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy:
          Platform.OS === "android"
            ? Location.Accuracy.Low
            : Location.Accuracy.Lowest,
      });

      setPosition({ latitude: coords.latitude, longitude: coords.longitude });
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
    getPosition,
    isLoadingPosition,
    isLoadingAddress,
    isLoadingGeocode,
  };
};

export default useLocation;
