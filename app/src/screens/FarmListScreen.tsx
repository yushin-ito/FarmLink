import React, { useCallback, useState } from "react";

import FarmListTemplate from "../components/templates/FarmListTemplate";
import { useQueryFarms } from "../hooks/farm/query";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { FarmStackScreenProps } from "../types";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useDeleteFarm } from "../hooks/farm/mutate";

const FarmListScreen = ({ navigation }: FarmStackScreenProps<"FarmList">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const {
    data: farms,
    refetch,
    isLoading: isLoadingFarms,
  } = useQueryFarms(session?.user.id);

  const [isRefetchingFarms, setIsRefetchingFarms] = useState(false);

  const { mutateAsync: mutateAsyncDeleteFarm } = useDeleteFarm({
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

  const refetchFarms = useCallback(async () => {
    setIsRefetchingFarms(true);
    await refetch();
    setIsRefetchingFarms(false);
  }, []);

  const deleteFarm = useCallback(async (FarmId: number) => {
    await mutateAsyncDeleteFarm(FarmId);
  }, []);

  const farmDeviceNavigationHandler = useCallback(
    (deviceId: string | null, name: string | null) => {
      navigation.navigate("FarmDevice", { deviceId, name });
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
      isLoadingFarms={isLoadingFarms}
      isRefetchingFarms={isRefetchingFarms}
      refetchFarms={refetchFarms}
      deleteFarm={deleteFarm}
      farmDeviceNavigationHandler={farmDeviceNavigationHandler}
      postFarmNavigationHandler={postFarmNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
    />
  );
};

export default FarmListScreen;
