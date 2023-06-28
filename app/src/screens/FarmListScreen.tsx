import React, { useCallback, useState } from "react";

import FarmListTemplate from "../components/templates/FarmListTemplate";
import { useQueryFarms } from "../hooks/farm/query";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { FarmStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useDeleteFarm } from "../hooks/farm/mutate";

type FarmListNavigationProp = NativeStackNavigationProp<
  FarmStackParamList,
  "FarmList"
>;

const FarmListScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const navigation = useNavigation<FarmListNavigationProp>();
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
          text={t("anyError")}
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

  const farmCameraNavigationHandler = useCallback(
    (farmId: number, farmName: string | null) => {
      navigation.navigate("FarmCamera", { farmId, farmName });
    },
    []
  );

  const postFarmNavigationHandler = useCallback(() => {
    navigation.navigate("PostFarm");
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("SettingNavigator", { screen: "Setting" });
  }, []);

  return (
    <FarmListTemplate
      user={user}
      farms={farms}
      isLoadingFarms={isLoadingFarms}
      isRefetchingFarms={isRefetchingFarms}
      refetchFarms={refetchFarms}
      deleteFarm={deleteFarm}
      farmCameraNavigationHandler={farmCameraNavigationHandler}
      postFarmNavigationHandler={postFarmNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
    />
  );
};

export default FarmListScreen;
