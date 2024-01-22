import React, { useCallback, useEffect, useState } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import EditFarmTemplate from "../components/templates/EditFarmTemplate";
import { showAlert } from "../functions";
import {
  useDeleteFarm,
  usePostFarmImage,
  useUpdateFarm,
} from "../hooks/farm/mutate";
import { useQueryFarm } from "../hooks/farm/query";
import useImage from "../hooks/sdk/useImage";
import useLocation from "../hooks/sdk/useLocation";
import { supabase } from "../supabase";
import { RootStackParamList, RootStackScreenProps } from "../types";

const EditFarmScreen = ({ navigation }: RootStackScreenProps) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { params } = useRoute<RouteProp<RootStackParamList, "EditFarm">>();

  const [images, setImages] = useState<string[]>([]);

  const { data: farm } = useQueryFarm(params.farmId);

  useEffect(() => {
    getPosition();
    farm?.imageUrls && setImages(farm.imageUrls);
  }, [farm]);

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

  const {
    mutateAsync: mutateAsyncPostFarmImage,
    isPending: isLoadingPostFarmImage,
  } = usePostFarmImage({
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

  const { pickImageByLibrary } = useImage({
    onSuccess: async ({ base64 }) => {
      if (base64) {
        setImages((prev) => [...prev, base64]);
      } else {
        showAlert(
          toast,
          <Alert
            status="error"
            onPressCloseButton={() => toast.closeAll()}
            text={t("error")}
          />
        );
      }
    },
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestCam")}
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

  const updateFarm = useCallback(
    async (
      name: string,
      crop: string,
      description: string,
      privated: boolean
    ) => {
      if (farm && position) {
        const publicUrls = await Promise.all(
          images.map(async (item) => {
            if (item.indexOf("http") == -1) {
              const { path } = await mutateAsyncPostFarmImage(item);
              const { data } = supabase.storage
                .from("image")
                .getPublicUrl(path);
              return data.publicUrl;
            } else {
              return item;
            }
          })
        );
        await mutateAsyncUpdateFarm({
          farmId: farm.farmId,
          name,
          crop,
          description,
          imageUrls: publicUrls,
          privated,
          latitude: position.latitude,
          longitude: position.longitude,
          location: `POINT(${position.longitude} ${position.latitude})`,
        });
      }
    },
    [farm, images, position]
  );

  const deleteFarm = useCallback(async () => {
    await mutateAsyncDeleteFarm(params.farmId);
  }, [params]);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EditFarmTemplate
      images={images}
      farm={farm}
      position={position}
      address={address}
      pickImageByLibrary={pickImageByLibrary}
      getAddress={getAddress}
      updateFarm={updateFarm}
      deleteFarm={deleteFarm}
      isLoadingUpdateFarm={isLoadingUpdateFarm || isLoadingPostFarmImage}
      isLoadingDeleteFarm={isLoadingDeleteFarm}
      isLoadingPosition={isLoadingPosition}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditFarmScreen;
