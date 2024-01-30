import { useState, useCallback, useMemo } from "react";
import { Platform } from "react-native";

import * as Location from "expo-location";
import { LatLng } from "react-native-maps";

type UseLocationType = {
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

const useLocation = ({ onError, onDisable }: UseLocationType) => {
  const [position, setPosition] = useState<LatLng>();
  const [address, setAddress] = useState<Location.LocationGeocodedAddress>();
  const [geocode, setGeocode] = useState<Location.LocationGeocodedLocation>();
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

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

  const prefectures = useMemo(
    () => [
      { id: 1, name: "北海道" },
      { id: 2, name: "青森県" },
      { id: 3, name: "岩手県" },
      { id: 4, name: "宮城県" },
      { id: 5, name: "秋田県" },
      { id: 6, name: "山形県" },
      { id: 7, name: "福島県" },
      { id: 8, name: "茨城県" },
      { id: 9, name: "栃木県" },
      { id: 10, name: "群馬県" },
      { id: 11, name: "埼玉県" },
      { id: 12, name: "千葉県" },
      { id: 13, name: "東京都" },
      { id: 14, name: "神奈川県" },
      { id: 15, name: "新潟県" },
      { id: 16, name: "富山県" },
      { id: 17, name: "石川県" },
      { id: 18, name: "福井県" },
      { id: 19, name: "山梨県" },
      { id: 20, name: "長野県" },
      { id: 21, name: "岐阜県" },
      { id: 22, name: "静岡県" },
      { id: 23, name: "愛知県" },
      { id: 24, name: "三重県" },
      { id: 25, name: "滋賀県" },
      { id: 26, name: "京都府" },
      { id: 27, name: "大阪府" },
      { id: 28, name: "兵庫県" },
      { id: 29, name: "奈良県" },
      { id: 30, name: "和歌山県" },
      { id: 31, name: "鳥取県" },
      { id: 32, name: "島根県" },
      { id: 33, name: "岡山県" },
      { id: 34, name: "広島県" },
      { id: 35, name: "山口県" },
      { id: 36, name: "徳島県" },
      { id: 37, name: "香川県" },
      { id: 38, name: "愛媛県" },
      { id: 39, name: "高知県" },
      { id: 40, name: "福岡県" },
      { id: 41, name: "佐賀県" },
      { id: 42, name: "長崎県" },
      { id: 43, name: "熊本県" },
      { id: 44, name: "大分県" },
      { id: 45, name: "宮崎県" },
      { id: 46, name: "鹿児島県" },
      { id: 47, name: "沖縄県" },
    ],
    []
  );

  const getCities = useCallback(async (prefectureId: number) => {
    setIsLoadingCities(true);
    try {
      const url = `https://www.land.mlit.go.jp/webland/api/CitySearch?area=${(
        "00" + prefectureId
      ).slice(-2)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.status === "OK") {
        setCities(result.data as { id: number; name: string }[]);
      } else {
        throw Error();
      }
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoadingCities(false);
    }
  }, []);

  return {
    position,
    address,
    geocode,
    prefectures,
    cities,
    getAddress,
    getGeocode,
    getPosition,
    getCities,
    isLoadingPosition,
    isLoadingAddress,
    isLoadingGeocode,
    isLoadingCities,
  };
};

export default useLocation;
