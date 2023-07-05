import React, { useCallback } from "react";
import MapTemplate from "../components/templates/MapTemplate";
import useLocation from "../hooks/sdk/useLocation";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MapStackParamList } from "../types";

type MapNavigationProp = NativeStackNavigationProp<MapStackParamList, "Map">;

const MapScreen = () => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const navigation = useNavigation<MapNavigationProp>();

  const { position, getCurrentPosition, isLoading: isLoadingLocation } = useLocation({
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
          text={t("anyError")}
        />
      );
    },
  });

  const searchFarmNavigationHandler = useCallback(() => {
    navigation.navigate("SearchFarm");
  }, []);

  return (
    <MapTemplate
      position={position}
      getCurrentPosition={getCurrentPosition}
      isLoadingPosition={isLoadingLocation}
      searchFarmNavigationHandler={searchFarmNavigationHandler}
    />
  );
};

export default MapScreen;
