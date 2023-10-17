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
  const [type, setType] = useState<"farm" | "rental">("rental");
  const [touch, setTouch] = useState<boolean>(false);
  const [region, setRegion] = useState<Region | null>(null);
  const [location, setLocation] = useState<LatLng>();

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
    setLocation(position);
  }, [position]);

  useEffect(() => {
    if (params?.regionId && params?.latitude && params?.longitude) {
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
    } else {
      getPosition();
    }
    params?.type === "farm" && refetchFarms();
    params?.type === "rental" && refetchRentals();
    params?.type && setType(params.type);
  }, [params]);

  const {
    data: rentals,
    refetch: refetchRentals,
    fetchNextPage: fetchNextPageRentals,
    isLoading: isLoadingRentals,
  } = useInfiniteQueryRentals("near", location);

  useEffect(() => {
    const channel = supabase
      .channel("rental")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rental",
        },
        () => {
          refetchRentals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const {
    data: farms,
    refetch: refetchFarms,
    fetchNextPage: fetchNextPageFams,
    isLoading: isLoadingFarms,
  } = useInfiniteQueryFarms(location);

  useEffect(() => {
    const channel = supabase
      .channel("farm")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "farm",
        },
        () => {
          refetchFarms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const farmDetailNavigationHandler = useCallback((farmId: number) => {
    navigation.navigate("FarmDetail", { farmId });
  }, []);

  const rentalDetailNavigationHandler = useCallback((rentalId: number) => {
    navigation.navigate("RentalDetail", { rentalId });
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
      farms={farms?.filter(
        (item) => !item.privated || item.ownerId === session?.user.id
      )}
      rentals={rentals?.filter(
        (item) => !item.privated || item.ownerId === session?.user.id
      )}
      readMore={type === "farm" ? fetchNextPageFams : fetchNextPageRentals}
      isLoading={
        isLoadingPosition || isLoadingUser || isLoadingRentals || isLoadingFarms
      }
      farmDetailNavigationHandler={farmDetailNavigationHandler}
      rentalDetailNavigationHandler={rentalDetailNavigationHandler}
      searchMapNavigationHandler={searchMapNavigationHandler}
      rentalGridNavigationHandler={rentalGridNavigationHandler}
    />
  );
};

export default MapScreen;
