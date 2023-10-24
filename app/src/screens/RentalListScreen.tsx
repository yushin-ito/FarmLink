import React, { useCallback, useEffect, useState } from "react";
import RentalListTemplate from "../components/templates/RentalListTemplate";
import { SettingStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUserRentals } from "../hooks/rental/query";
import { showAlert } from "../functions";
import { useDeleteRental, useUpdateRental } from "../hooks/rental/mutate";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { supabase } from "../supabase";

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

  useEffect(() => {
    const channel = supabase
      .channel("rental_list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rental",
          filter: `ownerId=eq.${session?.user.id}`,
        },
        async () => {
          await refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const {
    mutateAsync: mutateAsyncUpdateRental,
    isLoading: isLoadingUpdateRental,
  } = useUpdateRental({
    onSuccess: async () => {
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
    isLoading: isLoadingDeleteRental,
  } = useDeleteRental({
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
