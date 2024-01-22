import React, { useCallback, useEffect, useState } from "react";

import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostRentalTemplate from "../components/templates/PostRentalTemplate";
import { showAlert } from "../functions";
import { usePostRental, usePostRentalImage } from "../hooks/rental/mutate";
import useImage from "../hooks/sdk/useImage";
import useLocation from "../hooks/sdk/useLocation";
import { useQueryUser } from "../hooks/user/query";
import { supabase } from "../supabase";
import { Rate, SettingStackScreenProps } from "../types";

const PostRentalScreen = ({
  navigation,
}: SettingStackScreenProps<"PostRental">) => {
  const { t } = useTranslation("setting");
  const toast = useToast();

  const [base64, setBase64] = useState<string[]>([]);

  const { data: user } = useQueryUser();

  useEffect(() => {
    getPosition();
  }, []);

  const { position, address, getPosition, getAddress, isLoadingPosition } =
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

  const { mutateAsync: mutateAsyncPostRental, isPending: isLoadingPostRental } =
    usePostRental({
      onSuccess: async ({ rentalId, latitude, longitude }) => {
        navigation.goBack();
        navigation.navigate("TabNavigator", {
          screen: "MapNavigator",
          params: {
            screen: "Map",
            params: { regionId: rentalId, latitude, longitude, type: "rental" },
          },
        });
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
    mutateAsync: mutateAsyncPostRentalImage,
    isPending: isLoadingPostRentalImage,
  } = usePostRentalImage({
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

  const postRental = useCallback(
    async (
      name: string,
      description: string,
      fee: number,
      area: number,
      equipment: string,
      rate: Rate
    ) => {
      if (user && position) {
        const publicUrls = await Promise.all(
          base64.map(async (item) => {
            const { path } = await mutateAsyncPostRentalImage(item);
            const { data } = supabase.storage.from("image").getPublicUrl(path);
            return data.publicUrl;
          })
        );
        await mutateAsyncPostRental({
          name,
          description,
          ownerId: user.userId,
          longitude: position.longitude,
          latitude: position.latitude,
          fee,
          area,
          equipment,
          imageUrls: publicUrls,
          privated: false,
          rate,
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
    <PostRentalTemplate
      base64={base64}
      position={position}
      address={address}
      pickImageByLibrary={pickImageByLibrary}
      getAddress={getAddress}
      postRental={postRental}
      isLoadingPostRental={isLoadingPostRental || isLoadingPostRentalImage}
      isLoadingPosition={isLoadingPosition}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostRentalScreen;
