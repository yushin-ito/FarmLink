import React, { useCallback, useEffect, useState } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostFarmTemplate from "../components/templates/PostFarmTemplate";
import { showAlert } from "../functions";
import { SearchDeviceResponse, useSearchDevice } from "../hooks/device/mutate";
import { usePostFarm } from "../hooks/farm/mutate";
import useLocation from "../hooks/sdk/useLocation";
import { useQueryUser } from "../hooks/user/query";
import { FarmStackScreenProps } from "../types";

const PostFarmScreen = ({ navigation }: FarmStackScreenProps<"PostFarm">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();

  const [searchResult, setSearchResult] =
    useState<SearchDeviceResponse[number]>();

  const { data: user } = useQueryUser();

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

  const { mutateAsync: mutateAsyncPostFarm, isPending: isLoadingPostFarm } =
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
      if (user && position) {
        await mutateAsyncPostFarm({
          name,
          deviceId,
          description,
          ownerId: user.userId,
          privated,
          longitude: position.longitude,
          latitude: position.latitude,
          location: `POINT(${position.longitude} ${position.latitude})`,
        });
      }
    },
    [user, position]
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
