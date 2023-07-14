import React, { useCallback, useEffect, useState } from "react";
import MapTemplate from "../components/templates/MapTemplate";
import useLocation from "../hooks/sdk/useLocation";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import { MapStackParamList, MapStackScreenProps } from "../types";
import { GetFarmsResponse, useQueryFarms } from "../hooks/farm/query";
import { Region } from "react-native-maps";
import { GetRentalsResponse, useQueryRentals } from "../hooks/rental/query";
import { useRoute, RouteProp } from "@react-navigation/native";

const MapScreen = ({ navigation }: MapStackScreenProps<"Map">) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { data: queryFarms } = useQueryFarms();
  const { data: queryRentals } = useQueryRentals();
  const [farms, setFarms] = useState<GetFarmsResponse>();
  const [rentals, setRentals] = useState<GetRentalsResponse>();
  const { params } = useRoute<RouteProp<MapStackParamList, "Map">>();
  const [type, setType] = useState<"farm" | "rental">("farm");

  useEffect(() => {
    if (!params?.latitude && !params?.longitude) {
      getCurrentPosition();
    }
    params?.type && setType(params.type);
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

  const onRegionChange = useCallback(
    (region: Region) => {
      const farms = queryFarms?.filter(
        (item) =>
          !item.privated &&
          item.latitude &&
          item.longitude &&
          item.longitude >= region.longitude - 0.3 &&
          item.longitude <= region.longitude + 0.3 &&
          item.latitude >= region.latitude - 0.1 &&
          item.latitude <= region.latitude + 0.1
      );
      setFarms(farms);

      const rentals = queryRentals?.filter(
        (item) =>
          item.latitude &&
          item.longitude &&
          item.longitude >= region.longitude - 0.3 &&
          item.longitude <= region.longitude + 0.3 &&
          item.latitude >= region.latitude - 0.1 &&
          item.latitude <= region.latitude + 0.1
      );
      setRentals(rentals);
    },
    [queryFarms, queryRentals]
  );

  const rentalDetailNavigationHandler = useCallback((rentalId: number) => {
    navigation.navigate("RentalDetail", { rentalId });
  }, []);

  const searchMapNavigationHandler = useCallback(() => {
    navigation.navigate("SearchMap", { type: "rental" });
  }, []);

  return (
    <MapTemplate
      type={type}
      setType={setType}
      params={{ latitude: params?.latitude, longitude: params?.longitude }}
      position={position}
      farms={farms}
      rentals={rentals}
      onRegionChange={onRegionChange}
      getCurrentPosition={getCurrentPosition}
      isLoadingPosition={isLoadingPosition}
      rentalDetailNavigationHandler={rentalDetailNavigationHandler}
      searchMapNavigationHandler={searchMapNavigationHandler}
    />
  );
};

export default MapScreen;
