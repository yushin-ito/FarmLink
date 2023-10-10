import React, { useCallback, useState } from "react";
import RentalListTemplate from "../components/templates/RentalListTemplate";
import { SettingStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useQueryRentals, useQueryUserRentals } from "../hooks/rental/query";
import { showAlert, wait } from "../functions";
import { useDeleteRental, usePostRental } from "../hooks/rental/mutate";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";

const RentalListScreen = ({
  navigation,
}: SettingStackScreenProps<"RentalList">) => {
  const { t } = useTranslation("setting");
  const toast = useToast();
  const { session } = useAuth();
  const { refetch } = useQueryRentals();
  const {
    data: rentals,
    refetch: refetchUserRentals,
    isLoading: isLoadingRentals,
  } = useQueryUserRentals(session?.user.id);
  const [isRefetchingRentals, setIsRefetchingRentals] = useState(false);

  const { mutateAsync: mutateAsyncPostRental } = usePostRental({
    onSuccess: async () => {
      await refetch();
      await refetchUserRentals();
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

  const { mutateAsync: mutateAsyncDeleteRental } = useDeleteRental({
    onSuccess: async () => {
      await refetch();
      await refetchUserRentals();
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

  const deleteRental = useCallback(async (rentalId: number) => {
    await mutateAsyncDeleteRental(rentalId);
  }, []);

  const refetchRentals = useCallback(async () => {
    setIsRefetchingRentals(true);
    await refetch();
    setIsRefetchingRentals(false);
  }, []);

  const privateRental = useCallback(async (rentalId: number) => {
    await mutateAsyncPostRental({ rentalId, privated: true });
  }, []);

  const publicRental = useCallback(async (rentalId: number) => {
    await mutateAsyncPostRental({ rentalId, privated: false });
  }, []);

  const mapNavigationHandler = useCallback(
    async (id: number, latitude: number, longitude: number) => {
      navigation.goBack();
      await wait(0.1); // 800ms
      navigation.navigate("TabNavigator", {
        screen: "MapNavigator",
        params: {
          screen: "Map",
          params: { id, latitude, longitude, type: "rental" },
        },
      });
    },
    []
  );

  const postRentalNavigationHandler = useCallback(() => {
    navigation.goBack();
    navigation.navigate("PostRental");
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalListTemplate
      rentals={rentals}
      deleteRental={deleteRental}
      isLoadingRentals={isLoadingRentals}
      isRefetchingRentals={isRefetchingRentals}
      refetchRentals={refetchRentals}
      publicRental={publicRental}
      privateRental={privateRental}
      mapNavigationHandler={mapNavigationHandler}
      postRentalNavigationHandler={postRentalNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalListScreen;
