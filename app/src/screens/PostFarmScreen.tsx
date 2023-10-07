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

const PostFarmScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const navigation = useNavigation();
  const { session } = useAuth();
  const { refetch } = useQueryFarms();
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
      if (session) {
        await mutateAsyncPostFarm({
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
    [session, position]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostFarmTemplate
      isLoadingPostFarm={isLoadingPostFarm}
      isLoadingPosition={isLoadingPosition}
      position={position}
      address={address}
      getAddress={getAddress}
      getCurrentPosition={getCurrentPosition}
      searchResult={searchResult}
      postFarm={postFarm}
      searchDevice={searchDevice}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostFarmScreen;
