import React, { useCallback, useState } from "react";
import EditFarmTemplate from "../components/templates/EditFarmTemplate";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostFarm } from "../hooks/farm/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";
import { SearchDeviceResponse, useSearchDevice } from "../hooks/device/mutate";
import {
  useQueryFarm,
  useQueryFarms,
  useQueryUserFarms,
} from "../hooks/farm/query";
import useLocation from "../hooks/sdk/useLocation";
import { MapStackParamList, MapStackScreenProps } from "../types";

const EditFarmScreen = ({ navigation }: MapStackScreenProps<"EditFarm">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { params } = useRoute<RouteProp<MapStackParamList, "EditFarm">>();
  const { data: farm, isLoading: isLoadingFarm } = useQueryFarm(params.farmId);
  const { session } = useAuth();
  const { refetch } = useQueryFarms();
  const { refetch: refetchUserFarms } = useQueryUserFarms(session?.user.id);
  const [searchResult, setSearchResult] = useState<SearchDeviceResponse[0]>();

  const { mutateAsync: mutateAsyncPostFarm, isLoading: isLoadingPostFarm } =
    usePostFarm({
      onSuccess: async () => {
        await refetch();
        await refetchUserFarms();
        navigation.goBack();
        showAlert(
          toast,
          <Alert
            status="success"
            onPressCloseButton={() => toast.closeAll()}
            text={t("saved")}
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
    position,
    address,
    getCurrentPosition,
    getAddress,
    isLoadingPosition,
  } = useLocation({
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

  const searchDevice = useCallback(async (query: string) => {
    if (query === "") {
      setSearchResult(undefined);
      return;
    }
    await mutateAsyncSearchDevice(query);
  }, []);

  const postFarm = useCallback(
    async (
      name: string,
      deviceId: string,
      description: string,
      privated: boolean
    ) => {
      if (session && farm) {
        await mutateAsyncPostFarm({
          farmId: farm.farmId,
          name,
          deviceId,
          description,
          ownerId: session.user.id,
          privated,
          longitude: position?.coords.longitude,
          latitude: position?.coords.latitude,
        });
      }
    },
    [session, farm, position]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EditFarmTemplate
      farm={farm}
      position={position}
      address={address}
      getAddress={getAddress}
      getCurrentPosition={getCurrentPosition}
      searchResult={searchResult}
      postFarm={postFarm}
      searchDevice={searchDevice}
      isLoadingFarm={isLoadingFarm}
      isLoadingPostFarm={isLoadingPostFarm}
      isLoadingPosition={isLoadingPosition}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditFarmScreen;
