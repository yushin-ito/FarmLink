import React, { useCallback, useEffect, useState } from "react";
import MapTemplate from "../components/templates/MapTemplate";
import useLocation from "../hooks/sdk/useLocation";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import { MapStackParamList, MapStackScreenProps } from "../types";
import { useQueryFarms } from "../hooks/farm/query";
import { useQueryRentals } from "../hooks/rental/query";
import { useRoute, RouteProp } from "@react-navigation/native";
import { LatLng } from "react-native-maps";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";

const MapScreen = ({ navigation }: MapStackScreenProps<"Map">) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const {
    data: farms,
    refetch: refetchFarms,
    isLoading: isLoadingFarms,
  } = useQueryFarms(session?.user.id);
  const {
    data: rentals,
    refetch: refetchRentals,
    isLoading: isLoadingRentals,
  } = useQueryRentals(session?.user.id);
  const { params } = useRoute<RouteProp<MapStackParamList, "Map">>();
  const [id, setId] = useState<number | null>(null);
  const [type, setType] = useState<"farm" | "rental">("farm");
  const [region, setRegion] = useState<LatLng | null>(null);

  useEffect(() => {
    if (params?.latitude && params?.longitude) {
      setRegion({ latitude: params.latitude, longitude: params.longitude });
    } else {
      getCurrentPosition();
    }
    params?.type === "farm" && refetchFarms();
    params?.type === "rental" && refetchRentals();
    params?.type && setType(params.type);
    params?.id && setId(params.id);
  }, [params]);

  const { position, getCurrentPosition, isLoadingPosition } = useLocation({
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
    if (position) {
      setRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }
  }, [position]);

  const getDistance = useCallback(
    (latitude: number | null, longitude: number | null) => {
      if (position && latitude && longitude) {
        return (
          (position.coords.latitude - latitude) ** 2 +
          (position.coords.longitude - longitude) ** 2
        );
      }
      return 0;
    },
    [position]
  );

  const farmDetailNavigationHandler = useCallback((farmId: number) => {
    navigation.navigate("FarmDetail", { farmId });
  }, []);

  const rentalDetailNavigationHandler = useCallback((rentalId: number) => {
    navigation.navigate("RentalDetail", { rentalId });
  }, []);

  const searchMapNavigationHandler = useCallback(() => {
    navigation.navigate("SearchMap", { type });
  }, [type]);

  return (
    <MapTemplate
      type={type}
      setType={setType}
      id={id}
      region={region}
      setRegion={setRegion}
      position={position}
      user={user}
      farms={farms?.sort(
        (a, b) =>
          getDistance(a.latitude, a.longitude) -
          getDistance(b.latitude, b.longitude)
      )}
      rentals={rentals?.sort(
        (a, b) =>
          getDistance(a.latitude, a.longitude) -
          getDistance(b.latitude, b.longitude)
      )}
      isLoading={
        isLoadingPosition || isLoadingUser || isLoadingRentals || isLoadingFarms
      }
      farmDetailNavigationHandler={farmDetailNavigationHandler}
      rentalDetailNavigationHandler={rentalDetailNavigationHandler}
      searchMapNavigationHandler={searchMapNavigationHandler}
    />
  );
};

export default MapScreen;
