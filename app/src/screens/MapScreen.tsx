import React, { useCallback, useEffect, useState } from "react";
import MapTemplate from "../components/templates/MapTemplate";
import useLocation from "../hooks/sdk/useLocation";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import { MapStackParamList, MapStackScreenProps, Region } from "../types";
import { useInfiniteQueryFarms } from "../hooks/farm/query";
import { useInfiniteQueryRentals } from "../hooks/rental/query";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import { supabase } from "../supabase";
import { LatLng } from "react-native-maps";

const MapScreen = ({ navigation }: MapStackScreenProps<"Map">) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const { params } = useRoute<RouteProp<MapStackParamList, "Map">>();
  const [type, setType] = useState<"rental" | "farm">("rental");
  const [touch, setTouch] = useState<boolean>(false);
  const [region, setRegion] = useState<Region | null>(null);
  const [location, setLocation] = useState<LatLng>();
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

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

  const {
    data: rentals,
    refetch: refetchRentals,
    fetchNextPage: fetchNextPageRentals,
    isLoading: isLoadingRentals,
  } = useInfiniteQueryRentals("near", location);

  useEffect(() => {
    const channel = supabase
      .channel("rental_map")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rental",
          filter: `ownerId=eq.${session?.user.id}`,
        },
        async () => {
          await refetchRentals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const {
    data: farms,
    refetch: refetchFarms,
    fetchNextPage: fetchNextPageFams,
    isLoading: isLoadingFarms,
  } = useInfiniteQueryFarms(location);

  useEffect(() => {
    const channel = supabase
      .channel("farm_map")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "farm",
          filter: `ownerId=eq.${session?.user.id}`,
        },
        async () => {
          await refetchFarms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

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
    if (!region && type === "rental" && rentals?.length) {
      setRegion({
        regionId: rentals[0].rentalId,
        latitude: rentals[0].latitude,
        longitude: rentals[0].longitude,
      });
    }
    if (!region && type === "farm" && farms?.length) {
      setRegion({
        regionId: farms[0].farmId,
        latitude: farms[0].latitude,
        longitude: farms[0].longitude,
      });
    }
  }, [region, type, rentals, farms]);

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
      rentals={rentals?.filter(
        (item) => !item.privated || item.ownerId === session?.user.id
      )}
      farms={farms?.filter(
        (item) => !item.privated || item.ownerId === session?.user.id
      )}
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
