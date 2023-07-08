import React, { useCallback, useState } from "react";
import PostFarmTemplate from "../components/templates/PostFarmTemplate";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostFarm } from "../hooks/farm/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";
import { SearchDeviceResponse, useSearchDevice } from "../hooks/device/mutate";
import { useQueryFarms } from "../hooks/farm/query";
import useLocation from "../hooks/sdk/useLocation";

const PostFarmModal = () => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const navigation = useNavigation();
  const { session } = useAuth();
  const { refetch } = useQueryFarms(session?.user.id);
  const [searchResult, setSearchResult] = useState<SearchDeviceResponse[0]>();

  const { mutateAsync: mutateAsyncPostFarm, isLoading: isLoadingPostFarm } =
    usePostFarm({
      onSuccess: async () => {
        await refetch();
        navigation.goBack();
      },
      onError: () => {
        navigation.goBack();
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
          text={t("anyError")}
        />
      );
    },
  });

  const {
    position,
    getCurrentPosition,
    isLoading: isLoadingLocation,
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
          text={t("anyError")}
        />
      );
    },
  });

  const searchDevice = useCallback(async (text: string) => {
    if (text === "") {
      setSearchResult(undefined);
      return;
    }
    await mutateAsyncSearchDevice(text);
  }, []);

  const postFarm = useCallback(
    async (
      farmName: string,
      deviceId: string,
      description: string,
      privated: boolean
    ) => {
      await mutateAsyncPostFarm({
        farmName,
        deviceId,
        description,
        ownerId: session?.user.id,
        privated,
        longitude: privated ? null : position?.coords.longitude,
        latitude: privated ? null : position?.coords.latitude,
      });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostFarmTemplate
      isLoadingPostFarm={isLoadingPostFarm}
      isLoadingPosition={isLoadingLocation}
      position={position}
      getCurrentPosition={getCurrentPosition}
      searchResult={searchResult}
      postFarm={postFarm}
      searchDevice={searchDevice}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostFarmModal;
