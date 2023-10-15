import React, { useCallback, useEffect, useState } from "react";
import PostRentalTemplate from "../components/templates/PostRentalTemplate";
import { useToast } from "native-base";
import { showAlert, wait } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostRental, usePostRentalImage } from "../hooks/rental/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";
import useLocation from "../hooks/sdk/useLocation";
import useImage from "../hooks/sdk/useImage";
import { Rate, SettingStackScreenProps } from "../types";
import { supabase } from "../supabase";

const PostRentalScreen = ({
  navigation,
}: SettingStackScreenProps<"PostRental">) => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const { session } = useAuth();
  const [base64, setBase64] = useState<string[]>([]);

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

  const { mutateAsync: mutateAsyncPostRental, isLoading: isLoadingPostRental } =
    usePostRental({
      onSuccess: async (data) => {
        navigation.goBack();
        if (position) {
          await wait(0.1); // 800ms
          navigation.navigate("TabNavigator", {
            screen: "MapNavigator",
            params: {
              screen: "Map",
              params: {
                regionId: data[0].rentalId,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                type: "rental",
              },
            },
          });
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

  const {
    mutateAsync: mutateAsyncPostRentalImage,
    isLoading: isLoadingPostRentalImage,
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
        navigation.goBack();
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
      navigation.goBack();
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

  const postRental = useCallback(
    async (
      name: string,
      description: string,
      fee: number,
      area: number,
      equipment: string,
      rate: Rate
    ) => {
      if (session && position) {
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
          ownerId: session.user.id,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          fee,
          area,
          equipment,
          imageUrls: publicUrls,
          privated: false,
          rate,
          location: `POINT(${position.coords.longitude} ${position.coords.latitude})`,
        });
      }
    },
    [session, position, base64]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostRentalTemplate
      base64={base64}
      isLoadingPostRental={isLoadingPostRental || isLoadingPostRentalImage}
      isLoadingPosition={isLoadingPosition}
      position={position}
      address={address}
      pickImageByLibrary={pickImageByLibrary}
      getAddress={getAddress}
      postRental={postRental}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostRentalScreen;
