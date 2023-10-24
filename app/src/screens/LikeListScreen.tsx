import React, { useCallback, useEffect, useState } from "react";
import LikeListTemplate from "../components/templates/LikeListTemplate";
import { SettingStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUserLikes } from "../hooks/like/query";
import { showAlert } from "../functions";
import { useDeleteFarmLike, useDeleteRentalLike } from "../hooks/like/mutate";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { supabase } from "../supabase";

const LikeListScreen = ({
  navigation,
}: SettingStackScreenProps<"LikeList">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { session } = useAuth();
  const {
    data: likes,
    refetch,
    isLoading: isLoadingUserLikes,
  } = useQueryUserLikes(session?.user.id);
  const [isRefetchingLikes, setIsRefetchingRentals] = useState(false);
  const [type, setType] = useState<"rental" | "farm">("rental");

  useEffect(() => {
    const channel = supabase
      .channel("like_list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "like",
          filter: `userId=eq.${session?.user.id}`,
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
    mutateAsync: mutateAsyncDeleteRentalLike,
    isLoading: isLoadingDeleteRentalLike,
  } = useDeleteRentalLike({
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
    isLoading: isLoadingDeleteFarmLike,
  } = useDeleteFarmLike({
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
      await mutateAsyncDeleteRentalLike({ rentalId, userId: session?.user.id });
    },
    [session]
  );

  const deleteFarmLike = useCallback(
    async (farmId: number) => {
      await mutateAsyncDeleteFarmLike({ farmId, userId: session?.user.id });
    },
    [session]
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
