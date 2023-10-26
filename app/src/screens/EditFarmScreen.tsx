import React, { useCallback, useEffect, useState } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import EditFarmTemplate from "../components/templates/EditFarmTemplate";
import { showAlert } from "../functions";
import { SearchDeviceResponse, useSearchDevice } from "../hooks/device/mutate";
import { useDeleteFarm, useUpdateFarm } from "../hooks/farm/mutate";
import { useQueryFarm } from "../hooks/farm/query";
import useLocation from "../hooks/sdk/useLocation";
import { RootStackParamList, RootStackScreenProps } from "../types";

const EditFarmScreen = ({ navigation }: RootStackScreenProps) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { params } = useRoute<RouteProp<RootStackParamList, "EditFarm">>();

  const [searchResult, setSearchResult] =
    useState<SearchDeviceResponse[number]>();

  const { data: farm } = useQueryFarm(params.farmId);

  useEffect(() => {
    getPosition();
  }, []);

  const { mutateAsync: mutateAsyncUpdateFarm, isPending: isLoadingUpdateFarm } =
    useUpdateFarm({
      onSuccess: async () => {
        navigation.goBack();
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
        navigation.goBack();
        navigation.goBack();
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

  const { position, getPosition, address, getAddress, isLoadingPosition } =
    useLocation({
      onDisable: () => {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("permitRequestGPS")}
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

  const { mutateAsync: mutateAsyncSearchDevice } = useSearchDevice({
    onSuccess: (data) => {
      setSearchResult(data[0]);
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

  const searchDevice = useCallback(async (query: string) => {
    if (query === "") {
      setSearchResult(undefined);
      return;
    }
    await mutateAsyncSearchDevice(query);
  }, []);

  const updateFarm = useCallback(
    async (
      name: string,
      deviceId: string,
      description: string,
      privated: boolean
    ) => {
      if (farm && position) {
        await mutateAsyncUpdateFarm({
          farmId: farm.farmId,
          name,
          deviceId,
          description,
          privated,
          latitude: position.latitude,
          longitude: position.longitude,
          location: `POINT(${position.longitude} ${position.latitude})`,
        });
      }
    },
    [farm, position]
  );

  const deleteFarm = useCallback(async () => {
    await mutateAsyncDeleteFarm(params.farmId);
  }, [params]);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EditFarmTemplate
      farm={farm}
      position={position}
      address={address}
      getAddress={getAddress}
      searchResult={searchResult}
      updateFarm={updateFarm}
      deleteFarm={deleteFarm}
      searchDevice={searchDevice}
      isLoadingUpdateFarm={isLoadingUpdateFarm}
      isLoadingDeleteFarm={isLoadingDeleteFarm}
      isLoadingPosition={isLoadingPosition}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditFarmScreen;
