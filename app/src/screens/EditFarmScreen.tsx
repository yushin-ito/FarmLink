import React, { useCallback, useEffect, useState } from "react";
import EditFarmTemplate from "../components/templates/EditFarmTemplate";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { useUpdateFarm } from "../hooks/farm/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";
import { SearchDeviceResponse, useSearchDevice } from "../hooks/device/mutate";
import { useQueryFarm, useInfiniteQueryFarms } from "../hooks/farm/query";
import useLocation from "../hooks/sdk/useLocation";
import { MapStackParamList, MapStackScreenProps } from "../types";

const EditFarmScreen = ({ navigation }: MapStackScreenProps<"EditFarm">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { params } = useRoute<RouteProp<MapStackParamList, "EditFarm">>();
  const { data: farm } = useQueryFarm(params.farmId);
  const { session } = useAuth();
  const [searchResult, setSearchResult] = useState<SearchDeviceResponse[0]>();

  const { position, getCurrentPosition, address, getAddress } = useLocation({
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
  const { refetch } = useInfiniteQueryFarms(session?.user.id, position?.coords);

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const { mutateAsync: mutateAsyncUpdateFarm, isLoading: isLoadingUpdateFarm } =
    useUpdateFarm({
      onSuccess: async () => {
        await refetch();
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
      if (farm) {
        await mutateAsyncUpdateFarm({
          farmId: farm.farmId,
          name,
          deviceId,
          description,
          privated,
        });
      }
    },
    [farm]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EditFarmTemplate
      farm={farm}
      address={address}
      getAddress={getAddress}
      searchResult={searchResult}
      updateFarm={updateFarm}
      searchDevice={searchDevice}
      isLoadingUpdateFarm={isLoadingUpdateFarm}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditFarmScreen;
