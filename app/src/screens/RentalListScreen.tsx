import React, { useCallback, useRef, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import RentalListTemplate from "../components/templates/RentalListTemplate";
import { showAlert } from "../functions";
import { useDeleteRental, useUpdateRental } from "../hooks/rental/mutate";
import { useQueryUserRentals } from "../hooks/rental/query";
import { SettingStackScreenProps } from "../types";

const RentalListScreen = ({
  navigation,
}: SettingStackScreenProps<"RentalList">) => {
  const { t } = useTranslation("setting");
  const toast = useToast();

  const focusRef = useRef(true);
  const [isRefetchingRentals, setIsRefetchingRentals] = useState(false);

  const {
    data: rentals,
    refetch,
    isLoading: isLoadingRentals,
  } = useQueryUserRentals();

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetch();
    }, [])
  );

  const {
    mutateAsync: mutateAsyncUpdateRental,
    isPending: isLoadingUpdateRental,
  } = useUpdateRental({
    onSuccess: async () => {
      await refetch();
      showAlert(
        toast,
        <Alert
          status="success"
          onPressCloseButton={() => toast.closeAll()}
          text={t("changed")}
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
    mutateAsync: mutateAsyncDeleteRental,
    isPending: isLoadingDeleteRental,
  } = useDeleteRental({
    onSuccess: async () => {
      await refetch();
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
    navigation.navigate("PostRental");
  }, []);

  const deleteRental = useCallback(async (rentalId: number) => {
    await mutateAsyncDeleteRental(rentalId);
  }, []);

  const rentalDetailNavigationHandler = useCallback((rentalId: number) => {
    navigation.navigate("RentalDetail", { rentalId });
  }, []);

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
      rentalDetailNavigationHandler={rentalDetailNavigationHandler}
      postRentalNavigationHandler={postRentalNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalListScreen;
