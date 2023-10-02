import React, { useCallback, useState } from "react";
import FarmListTemplate from "../components/templates/FarmListTemplate";
import { useQueryFarms, useQueryUserFarms } from "../hooks/farm/query";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { FarmStackScreenProps } from "../types";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useDeleteFarm, usePostFarm } from "../hooks/farm/mutate";

const FarmListScreen = ({ navigation }: FarmStackScreenProps<"FarmList">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const { refetch } = useQueryFarms();
  const {
    data: farms,
    refetch: refetchUserFarms,
    isLoading: isLoadingFarms,
  } = useQueryUserFarms(session?.user.id);
  const [isRefetchingFarms, setIsRefetchingFarms] = useState(false);

  const { mutateAsync: mutateAsyncPostFarm } = usePostFarm({
    onSuccess: async () => {
      await refetch();
      await refetchUserFarms();
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

  const { mutateAsync: mutateAsyncDeleteFarm } = useDeleteFarm({
    onSuccess: async () => {
      await refetch();
      await refetchUserFarms();
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

  const refetchFarms = useCallback(async () => {
    setIsRefetchingFarms(true);
    await refetchUserFarms();
    setIsRefetchingFarms(false);
  }, []);

  const deleteFarm = useCallback(async (farmId: number) => {
    await mutateAsyncDeleteFarm(farmId);
  }, []);

  const privateFarm = useCallback(async (farmId: number) => {
    await mutateAsyncPostFarm({ farmId, privated: true });
  }, []);

  const publicFarm = useCallback(async (farmId: number) => {
    await mutateAsyncPostFarm({ farmId, privated: false });
  }, []);

  const farmDetailNavigationHandler = useCallback(
    (farmId: number, deviceId: string | null) => {
      navigation.navigate("FarmDetail", { farmId, deviceId });
    },
    []
  );

  const postFarmNavigationHandler = useCallback(() => {
    navigation.navigate("PostFarm");
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
      isLoading={isLoadingUser || isLoadingFarms}
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
