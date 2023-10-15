import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/auth/useAuth";
import { MapStackScreenProps, Scene } from "../types";
import RentalGridTemplate from "../components/templates/RentalGridTemplate";
import { showAlert } from "../functions";
import { useInfiniteQueryRentals } from "../hooks/rental/query";
import useLocation from "../hooks/sdk/useLocation";
import Alert from "../components/molecules/Alert";
import { supabase } from "../supabase";

const RentalGridScreen = ({
  navigation,
}: MapStackScreenProps<"RentalGrid">) => {
  const toast = useToast();
  const { t } = useTranslation("map");
  const { session } = useAuth();
  const scenes = ["near", "popular", "newest", "lowest"] as Scene[];
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
  } = useInfiniteQueryRentals(
    scenes[sceneIndex],
    session?.user.id,
    position
  );

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
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalGridTemplate
      sceneIndex={sceneIndex}
      setSceneIndex={setSceneIndex}
      rentals={rentals}
      refetchRentals={refetchRentals}
      isLoading={isLoadingPosition || isLoadingRentals}
      isRefetchingRentals={isRefetchingRentals}
      postRentalNavigationHandler={postRentalNavigationHandler}
      searchMapNavigationHandler={searchMapNavigationHandler}
      rentalDetailNavigationHandler={rentalDetailNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalGridScreen;
