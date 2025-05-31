import React, { useCallback, useRef, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import LikeListTemplate from "../components/templates/LikeListTemplate";
import { showAlert } from "../functions";
import { useDeleteFarmLike, useDeleteRentalLike } from "../hooks/like/mutate";
import { useQueryUserLikes } from "../hooks/like/query";
import { useQueryUser } from "../hooks/user/query";
import { SettingStackScreenProps } from "../types";

const LikeListScreen = ({
  navigation,
}: SettingStackScreenProps<"LikeList">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();

  const focusRef = useRef(true);
  const [isRefetchingLikes, setIsRefetchingRentals] = useState(false);
  const [type, setType] = useState<"rental" | "farm">("rental");

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const {
    data: likes,
    refetch,
    isLoading: isLoadingUserLikes,
  } = useQueryUserLikes();

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
    mutateAsync: mutateAsyncDeleteRentalLike,
    isPending: isLoadingDeleteRentalLike,
  } = useDeleteRentalLike({
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

  const {
    mutateAsync: mutateAsyncDeleteFarmLike,
    isPending: isLoadingDeleteFarmLike,
  } = useDeleteFarmLike({
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

  const deleteRentalLike = useCallback(
    async (rentalId: number) => {
      await mutateAsyncDeleteRentalLike({ rentalId, userId: user?.userId });
    },
    [user]
  );

  const deleteFarmLike = useCallback(
    async (farmId: number) => {
      await mutateAsyncDeleteFarmLike({ farmId, userId: user?.userId });
    },
    [user]
  );

  const refetchLikes = useCallback(async () => {
    setIsRefetchingRentals(true);
    await refetch();
    setIsRefetchingRentals(false);
  }, []);

  const rentalDetailNavigationHandler = useCallback((rentalId: number) => {
    navigation.navigate("RentalDetail", { rentalId });
  }, []);

  const farmDetailNavigationHandler = useCallback((farmId: number) => {
    navigation.navigate("FarmDetail", { farmId });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <LikeListTemplate
      type={type}
      setType={setType}
      likes={likes}
      deleteRentalLike={deleteRentalLike}
      deleteFarmLike={deleteFarmLike}
      refetchLikes={refetchLikes}
      isLoading={
        isLoadingUser ||
        isLoadingUserLikes ||
        isLoadingDeleteRentalLike ||
        isLoadingDeleteFarmLike
      }
      isRefetchingLikes={isRefetchingLikes}
      rentalDetailNavigationHandler={rentalDetailNavigationHandler}
      farmDetailNavigationHandler={farmDetailNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default LikeListScreen;
