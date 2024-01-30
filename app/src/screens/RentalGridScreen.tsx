import React, { useCallback, useEffect, useRef, useState } from "react";

import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import RentalGridTemplate from "../components/templates/RentalGridTemplate";
import { showAlert } from "../functions";
import { useInfiniteQueryRentals } from "../hooks/rental/query";
import useLocation from "../hooks/sdk/useLocation";
import { MapStackParamList, MapStackScreenProps, Scene } from "../types";

const scenes = ["near", "popular", "newest", "lowest"] as Scene[];

const RentalGridScreen = ({
  navigation,
}: MapStackScreenProps<"RentalGrid">) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { params } = useRoute<RouteProp<MapStackParamList, "RentalGrid">>();

  const focusRef = useRef(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isRefetchingRentals, setIsRefetchingRentals] = useState(false);

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
    refetch,
    isLoading: isLoadingRentals,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryRentals(scenes[sceneIndex], position, params?.option);

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetch();
    }, [])
  );

  useEffect(() => {
    getPosition();
  }, []);

  const refetchRentals = useCallback(async () => {
    setIsRefetchingRentals(true);
    await refetch();
    setIsRefetchingRentals(false);
  }, []);

  const postRentalNavigationHandler = useCallback(async () => {
    navigation.navigate("PostRental");
  }, []);

  const searchMapNavigationHandler = useCallback(() => {
    navigation.navigate("SearchMap", { type: "rental" });
  }, []);

  const rentalDetailNavigationHandler = useCallback((rentalId: number) => {
    navigation.navigate("RentalDetail", { rentalId });
  }, []);

  const FilterRentalNavigationHandler = useCallback(() => {
    navigation.navigate("FilterRental");
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalGridTemplate
      sceneIndex={sceneIndex}
      setSceneIndex={setSceneIndex}
      rentals={rentals?.pages[0]}
      refetchRentals={refetchRentals}
      readMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoading={isLoadingPosition || isLoadingRentals}
      isRefetchingRentals={isRefetchingRentals}
      postRentalNavigationHandler={postRentalNavigationHandler}
      searchMapNavigationHandler={searchMapNavigationHandler}
      rentalDetailNavigationHandler={rentalDetailNavigationHandler}
      FilterRentalNavigationHandler={FilterRentalNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalGridScreen;
