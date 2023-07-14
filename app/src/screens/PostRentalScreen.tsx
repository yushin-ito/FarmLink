import React, { useCallback, useState } from "react";
import PostRentalTemplate from "../components/templates/PostRentalTemplate";
import { useToast } from "native-base";
import { showAlert, wait } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostRental } from "../hooks/rental/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";
import useLocation from "../hooks/sdk/useLocation";
import useImage from "../hooks/sdk/useImage";
import { useQueryUserRentals } from "../hooks/rental/query";
import { SettingStackScreenProps } from "../types";

const PostRentalScreen = ({
  navigation,
}: SettingStackScreenProps<"PostRental">) => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const { session } = useAuth();
  const { refetch } = useQueryUserRentals(session?.user.id);
  const [base64, setBase64] = useState<string[]>([]);

  const { mutateAsync: mutateAsyncPostRental, isLoading: isLoadingPostRental } =
    usePostRental({
      onSuccess: async () => {
        await refetch();
        navigation.goBack();
        await wait(0.1); // 800ms
        navigation.navigate("TabNavigator", {
          screen: "MapNavigator",
          params: {
            screen: "Map",
            params: {
              latitude: position?.coords.latitude,
              longitude: position?.coords.longitude,
              type: "rental",
            },
          },
        });
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

  const {
    position,
    address,
    getCurrentPosition,
    getAddress,
    isLoadingPosition,
  } = useLocation({
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

  const postRental = useCallback(
    async (
      name: string,
      description: string,
      fee: string,
      area: string,
      equipment: string
    ) => {
      session &&
        position &&
        (await mutateAsyncPostRental({
          base64,
          rental: {
            name,
            description,
            ownerId: session.user.id,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            fee,
            area,
            equipment,
          },
        }));
    },
    [session?.user, position?.coords, base64]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostRentalTemplate
      base64={base64}
      isLoadingPostRental={isLoadingPostRental}
      isLoadingPosition={isLoadingPosition}
      position={position}
      address={address}
      pickImageByLibrary={pickImageByLibrary}
      getCurrentPosition={getCurrentPosition}
      getAddress={getAddress}
      postRental={postRental}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostRentalScreen;
