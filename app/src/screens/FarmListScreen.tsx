import React, { useCallback, useRef, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import FarmListTemplate from "../components/templates/FarmListTemplate";
import { showAlert } from "../functions";
import { useDeleteFarm, useUpdateFarm } from "../hooks/farm/mutate";
import { useQueryUserFarms } from "../hooks/farm/query";
import { useQueryUser } from "../hooks/user/query";
import { FarmStackScreenProps } from "../types";

const FarmListScreen = ({ navigation }: FarmStackScreenProps<"FarmList">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();

  const focusRef = useRef(true);
  const [isRefetchingFarms, setIsRefetchingFarms] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const {
    data: farms,
    refetch,
    isLoading: isLoadingFarms,
  } = useQueryUserFarms();

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetch();
    }, [])
  );

  const { mutateAsync: mutateAsyncUpdateFarm, isPending: isLoadingUpdateFarm } =
    useUpdateFarm({
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

  const { mutateAsync: mutateAsyncDeleteFarm, isPending: isLoadingDeleteFarm } =
    useDeleteFarm({
      onSuccess: async () => {
        await refetch();
      },
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
      refetchFarms={refetchFarms}
      deleteFarm={deleteFarm}
      privateFarm={privateFarm}
      publicFarm={publicFarm}
      isLoading={
        isLoadingUser ||
        isLoadingFarms ||
        isLoadingUpdateFarm ||
        isLoadingDeleteFarm
      }
      isRefetchingFarms={isRefetchingFarms}
      farmDetailNavigationHandler={farmDetailNavigationHandler}
      postFarmNavigationHandler={postFarmNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
    />
  );
};

export default FarmListScreen;
