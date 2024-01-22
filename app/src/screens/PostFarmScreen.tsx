import React, { useCallback, useEffect, useState } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostFarmTemplate from "../components/templates/PostFarmTemplate";
import { showAlert } from "../functions";
import { usePostFarm, usePostFarmImage } from "../hooks/farm/mutate";
import useImage from "../hooks/sdk/useImage";
import useLocation from "../hooks/sdk/useLocation";
import { useQueryUser } from "../hooks/user/query";
import { supabase } from "../supabase";
import { FarmStackScreenProps } from "../types";

const PostFarmScreen = ({ navigation }: FarmStackScreenProps<"PostFarm">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();

  const [base64, setBase64] = useState<string[]>([]);

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
        setBase64((prev) => [...prev, base64]);
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

  const postFarm = useCallback(
    async (
      name: string,
      crop: string,
      description: string,
      privated: boolean
    ) => {
      if (user && position) {
        const publicUrls = await Promise.all(
          base64.map(async (item) => {
            const { path } = await mutateAsyncPostFarmImage(item);
            const { data } = supabase.storage.from("image").getPublicUrl(path);
            return data.publicUrl;
          })
        );
        await mutateAsyncPostFarm({
          name,
          crop,
          description,
          ownerId: user.userId,
          imageUrls: publicUrls,
          privated,
          longitude: position.longitude,
          latitude: position.latitude,
          location: `POINT(${position.longitude} ${position.latitude})`,
        });
      }
    },
    [user, base64, position]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostFarmTemplate
      base64={base64}
      position={position}
      address={address}
      pickImageByLibrary={pickImageByLibrary}
      getAddress={getAddress}
      postFarm={postFarm}
      isLoadingPostFarm={isLoadingPostFarm || isLoadingPostFarmImage}
      isLoadingPosition={isLoadingPosition}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostFarmScreen;
