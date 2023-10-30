import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import { LatLng } from "react-native-maps";

import Alert from "../components/molecules/Alert";
import MapTemplate from "../components/templates/MapTemplate";
import { showAlert } from "../functions";
import { useInfiniteQueryFarms } from "../hooks/farm/query";
import { useInfiniteQueryRentals } from "../hooks/rental/query";
import useLocation from "../hooks/sdk/useLocation";
import { useQueryUser } from "../hooks/user/query";
import { MapStackParamList, MapStackScreenProps, Region } from "../types";

const MapScreen = ({ navigation }: MapStackScreenProps<"Map">) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { params } = useRoute<RouteProp<MapStackParamList, "Map">>();

  const focusRef = useRef(true);
  const [type, setType] = useState<"rental" | "farm">("rental");
  const [touch, setTouch] = useState<boolean>(false);
  const [region, setRegion] = useState<Region | null>(null);
  const [location, setLocation] = useState<LatLng>();
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const {
    data: rentals,
    refetch: refetchRentals,
    fetchNextPage: fetchNextPageRentals,
    isLoading: isLoadingRentals,
  } = useInfiniteQueryRentals("near", location);

  const {
    data: farms,
    refetch: refetchFarms,
    fetchNextPage: fetchNextPageFams,
    isLoading: isLoadingFarms,
  } = useInfiniteQueryFarms(location);

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }
      refetchRentals();
      refetchFarms();
    }, [])
  );

  useEffect(() => {
    if (params) {
      setTouch(false);
      setRegion({
        regionId: params.regionId,
        latitude: params.latitude,
        longitude: params.longitude,
      });
      setLocation({
        latitude: params.latitude,
        longitude: params.longitude,
      });
      setType(params.type);
    } else {
      getPosition();
    }
  }, [params]);

  useEffect(() => {
    if (!region && type === "rental" && rentals?.pages[0].length) {
      setRegion({
        regionId: rentals?.pages[0][0].rentalId,
        latitude: rentals?.pages[0][0].latitude,
        longitude: rentals?.pages[0][0].longitude,
      });
    }
    if (!region && type === "farm" && farms?.pages[0].length) {
      setRegion({
        regionId: farms?.pages[0][0].farmId,
        latitude: farms?.pages[0][0].latitude,
        longitude: farms?.pages[0][0].longitude,
      });
    }
  }, [region, type, rentals, farms]);

  const { position, getPosition, isLoadingPosition } = useLocation({
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestGPS")}
        />
      );
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  useEffect(() => {
    setTouch(false);
    setRegion(null);
    setLocation(position);
  }, [position]);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await getPosition();
    setIsRefetching(false);
  }, []);

  const rentalDetailNavigationHandler = useCallback((rentalId: number) => {
    navigation.navigate("RentalDetail", { rentalId });
  }, []);

  const farmDetailNavigationHandler = useCallback((farmId: number) => {
    navigation.navigate("FarmDetail", { farmId });
  }, []);

  const searchMapNavigationHandler = useCallback(() => {
    navigation.navigate("SearchMap", { type });
  }, [type]);

  const rentalGridNavigationHandler = useCallback(() => {
    navigation.navigate("RentalGrid");
  }, []);

  return (
    <MapTemplate
      type={type}
      setType={setType}
      touch={touch}
      setTouch={setTouch}
      region={region}
      setRegion={setRegion}
      position={position}
      user={user}
      rentals={rentals?.pages[0]}
      farms={farms?.pages[0]}
      refetch={refetch}
      readMore={type === "rental" ? fetchNextPageRentals : fetchNextPageFams}
      isLoading={
        isLoadingPosition || isLoadingUser || isLoadingRentals || isLoadingFarms
      }
      isRefetching={isRefetching}
      rentalDetailNavigationHandler={rentalDetailNavigationHandler}
      farmDetailNavigationHandler={farmDetailNavigationHandler}
      searchMapNavigationHandler={searchMapNavigationHandler}
      rentalGridNavigationHandler={rentalGridNavigationHandler}
    />
  );
};

export default MapScreen;
