import React, { useCallback, useState } from "react";
import RentalListTemplate from "../components/templates/RentalListTemplate";
import { SettingStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUserRentals } from "../hooks/rental/query";
import { showAlert, wait } from "../functions";
import { useDeleteRental, useUpdateRental } from "../hooks/rental/mutate";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";

const RentalListScreen = ({
  navigation,
}: SettingStackScreenProps<"RentalList">) => {
  const { t } = useTranslation("setting");
  const toast = useToast();
  const { session } = useAuth();
  const {
    data: rentals,
    refetch,
    isLoading: isLoadingRentals,
  } = useQueryUserRentals(session?.user.id);
  const [isRefetchingRentals, setIsRefetchingRentals] = useState(false);

  const {
    mutateAsync: mutateAsyncUpdateRental,
    isLoading: isLoadingUpdateRental,
  } = useUpdateRental({
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
      navigation.goBack();
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
    mutateAsync: mutateAsyncDeleteRental,
    isLoading: isLoadingDeleteRental,
  } = useDeleteRental({
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
      navigation.goBack();
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

  const refetchRentals = useCallback(async () => {
    setIsRefetchingRentals(true);
    await refetch();
    setIsRefetchingRentals(false);
  }, []);

  const privateRental = useCallback(async (rentalId: number) => {
    await mutateAsyncUpdateRental({ rentalId, privated: true });
  }, []);

  const publicRental = useCallback(async (rentalId: number) => {
    await mutateAsyncUpdateRental({ rentalId, privated: false });
  }, []);

  const postRentalNavigationHandler = useCallback(() => {
    navigation.goBack();
    navigation.navigate("PostRental");
  }, []);

  const deleteRental = useCallback(async (rentalId: number) => {
    await mutateAsyncDeleteRental(rentalId);
  }, []);

  const mapNavigationHandler = useCallback(
    async (regionId: number, latitude: number, longitude: number) => {
      navigation.goBack();
      await wait(0.1);
      navigation.navigate("TabNavigator", {
        screen: "MapNavigator",
        params: {
          screen: "Map",
          params: { regionId, latitude, longitude, type: "rental" },
        },
      });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalListTemplate
      rentals={rentals}
      deleteRental={deleteRental}
      refetchRentals={refetchRentals}
      publicRental={publicRental}
      privateRental={privateRental}
      isLoading={
        isLoadingRentals || isLoadingUpdateRental || isLoadingDeleteRental
      }
      isRefetchingRentals={isRefetchingRentals}
      mapNavigationHandler={mapNavigationHandler}
      postRentalNavigationHandler={postRentalNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalListScreen;
