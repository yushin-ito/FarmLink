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
import { useDeleteFarm, useUpdateFarm } from "../hooks/farm/mutate";

const FarmListScreen = ({ navigation }: FarmStackScreenProps<"FarmList">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const { refetch } = useQueryFarms(session?.user.id);
  const {
    data: farms,
    refetch: refetchUserFarms,
    isLoading: isLoadingFarms,
  } = useQueryUserFarms(session?.user.id);
  const [isRefetchingFarms, setIsRefetchingFarms] = useState(false);

  const { mutateAsync: mutateAsyncUpdateFarm } = useUpdateFarm({
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
    await mutateAsyncUpdateFarm({ farmId, privated: true });
  }, []);

  const publicFarm = useCallback(async (farmId: number) => {
    await mutateAsyncUpdateFarm({ farmId, privated: false });
  }, []);

  const mapNavigationHandler = useCallback(
    (regionId: number, latitude: number, longitude: number) => {
      navigation.navigate("TabNavigator", {
        screen: "MapNavigator",
        params: {
          screen: "Map",
          params: { regionId, latitude, longitude, type: "farm" },
        },
      });
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
      mapNavigationHandler={mapNavigationHandler}
      postFarmNavigationHandler={postFarmNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
    />
  );
};

export default FarmListScreen;
