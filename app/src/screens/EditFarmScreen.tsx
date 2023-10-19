import React, { useCallback, useEffect, useState } from "react";
import EditFarmTemplate from "../components/templates/EditFarmTemplate";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useDeleteFarm, useUpdateFarm } from "../hooks/farm/mutate";
import { useTranslation } from "react-i18next";
import { SearchDeviceResponse, useSearchDevice } from "../hooks/device/mutate";
import { useQueryFarm } from "../hooks/farm/query";
import useLocation from "../hooks/sdk/useLocation";
import { MapStackParamList, MapStackScreenProps } from "../types";

const EditFarmScreen = ({ navigation }: MapStackScreenProps<"EditFarm">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { params } = useRoute<RouteProp<MapStackParamList, "EditFarm">>();
  const { data: farm, refetch: refetchFarm } = useQueryFarm(params.farmId);
  const [searchResult, setSearchResult] =
    useState<SearchDeviceResponse[number]>();

  useEffect(() => {
    getPosition();
  }, []);

  const { mutateAsync: mutateAsyncUpdateFarm, isLoading: isLoadingUpdateFarm } =
    useUpdateFarm({
      onSuccess: async (data) => {
        await refetchFarm();
        if (position && data?.length) {
          navigation.navigate("Map", {
            regionId: data[0].farmId,
            latitude: position.latitude,
            longitude: position.longitude,
            type: "farm",
          });
          showAlert(
            toast,
            <Alert
              status="success"
              onPressCloseButton={() => toast.closeAll()}
              text={t("saved")}
            />
          );
        }
      },
      onError: () => {
        navigation.goBack();
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
      onSuccess: async () => {
        navigation.goBack();
        navigation.goBack();
        await refetchFarm();
      },
      onError: () => {
        navigation.goBack();
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
        navigation.goBack();
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
        navigation.goBack();
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
      navigation.goBack();
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
