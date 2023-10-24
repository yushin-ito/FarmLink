import React, { useCallback, useEffect, useState } from "react";
import PostFarmTemplate from "../components/templates/PostFarmTemplate";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostFarm } from "../hooks/farm/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";
import { SearchDeviceResponse, useSearchDevice } from "../hooks/device/mutate";
import useLocation from "../hooks/sdk/useLocation";
import { FarmStackScreenProps } from "../types";

const PostFarmScreen = ({ navigation }: FarmStackScreenProps<"PostFarm">) => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const { session } = useAuth();
  const [searchResult, setSearchResult] =
    useState<SearchDeviceResponse[number]>();

  useEffect(() => {
    getPosition();
  }, []);

  const { position, address, getPosition, getAddress, isLoadingPosition } =
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

  const { mutateAsync: mutateAsyncPostFarm, isLoading: isLoadingPostFarm } =
    usePostFarm({
      onSuccess: () => {
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

  const postFarm = useCallback(
    async (
      name: string,
      deviceId: string,
      description: string,
      privated: boolean
    ) => {
      if (session && position) {
        await mutateAsyncPostFarm({
          name,
          deviceId,
          description,
          ownerId: session.user.id,
          privated,
          longitude: position.longitude,
          latitude: position.latitude,
          location: `POINT(${position.longitude} ${position.latitude})`,
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
      position={position}
      address={address}
      getAddress={getAddress}
      searchResult={searchResult}
      postFarm={postFarm}
      searchDevice={searchDevice}
      isLoadingPostFarm={isLoadingPostFarm}
      isLoadingPosition={isLoadingPosition}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostFarmScreen;
