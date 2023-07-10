import React, { useCallback, useState } from "react";
import PostRentalTemplate from "../components/templates/PostRentalTemplate";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostRental } from "../hooks/rental/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";
import useLocation from "../hooks/sdk/useLocation";
import useImage from "../hooks/sdk/useImage";

const PostRentalScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const navigation = useNavigation();
  const { session } = useAuth();
  const [uri, setUri] = useState<string[]>([]);
  const [base64, setBase64] = useState<string[]>([]);

  const { mutateAsync: mutateAsyncPostRental, isLoading: isLoadingPostRental } =
    usePostRental({
      onSuccess: async () => {
        // await refetch();
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

  const { pickImageByCamera, pickImageByLibrary } = useImage({
    onSuccess: async ({ uri, base64 }) => {
      if (uri && base64) {
        setUri((prev) => [...prev, uri]);
        setBase64((prev) => [...prev, base64]);
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
          text={t("anyError")}
        />
      );
    },
  });

  const postRental = useCallback(
    async (rentalName: string, description: string) => {
      await mutateAsyncPostRental({
        base64,
        rental: {
          rentalName,
          description,
          ownerId: session?.user.id,
          longitude: position?.coords.longitude,
          latitude: position?.coords.latitude,
        },
      });
    },
    [session?.user, position?.coords, base64]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostRentalTemplate
      uri={uri}
      isLoadingPostRental={isLoadingPostRental}
      isLoadingPosition={isLoadingLocation}
      position={position}
      pickImageByCamera={pickImageByCamera}
      pickImageByLibrary={pickImageByLibrary}
      getCurrentPosition={getCurrentPosition}
      postRental={postRental}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostRentalScreen;
