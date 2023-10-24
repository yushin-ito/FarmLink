import React, { useCallback, useEffect, useState } from "react";
import FarmListTemplate from "../components/templates/FarmListTemplate";
import { useQueryUserFarms } from "../hooks/farm/query";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { FarmStackScreenProps } from "../types";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useDeleteFarm, useUpdateFarm } from "../hooks/farm/mutate";
import { supabase } from "../supabase";

const FarmListScreen = ({ navigation }: FarmStackScreenProps<"FarmList">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const {
    data: farms,
    refetch,
    isLoading: isLoadingFarms,
  } = useQueryUserFarms(session?.user.id);
  const [isRefetchingFarms, setIsRefetchingFarms] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("farm_list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "farm",
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

  const { mutateAsync: mutateAsyncUpdateFarm, isLoading: isLoadingUpdateFarm } =
    useUpdateFarm({
      onSuccess: () => {
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

  const { mutateAsync: mutateAsyncDeleteFarm, isLoading: isLoadingDeleteFarm } =
    useDeleteFarm({
      onError: () => {
        showAlert(
          toast,
          <Alert
            status="success"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      },
    });

  const refetchFarms = useCallback(async () => {
    setIsRefetchingFarms(true);
    await refetch();
    setIsRefetchingFarms(false);
  }, []);

  const privateFarm = useCallback(async (farmId: number) => {
    await mutateAsyncUpdateFarm({ farmId, privated: true });
  }, []);

  const publicFarm = useCallback(async (farmId: number) => {
    await mutateAsyncUpdateFarm({ farmId, privated: false });
  }, []);

  const deleteFarm = useCallback(async (farmId: number) => {
    await mutateAsyncDeleteFarm(farmId);
  }, []);

  const postFarmNavigationHandler = useCallback(() => {
    navigation.navigate("PostFarm");
  }, []);

  const farmDetailNavigationHandler = useCallback((farmId: number) => {
    navigation.navigate("FarmDetail", { farmId });
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("TabNavigator", {
      screen: "SettingNavigator",
      params: {
        screen: "Setting",
      },
    });
  }, []);

  return (
    <FarmListTemplate
      user={user}
      farms={farms}
      isLoading={
        isLoadingUser ||
        isLoadingFarms ||
        isLoadingUpdateFarm ||
        isLoadingDeleteFarm
      }
      isRefetchingFarms={isRefetchingFarms}
      refetchFarms={refetchFarms}
      deleteFarm={deleteFarm}
      privateFarm={privateFarm}
      publicFarm={publicFarm}
      farmDetailNavigationHandler={farmDetailNavigationHandler}
      postFarmNavigationHandler={postFarmNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
    />
  );
};

export default FarmListScreen;
