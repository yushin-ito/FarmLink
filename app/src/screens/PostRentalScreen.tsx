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
import { useQueryRentals } from "../hooks/rental/query";

const PostRentalScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const navigation = useNavigation();
  const { session } = useAuth();
  const { refetch } = useQueryRentals(session?.user.id);
  const [base64, setBase64] = useState<string[]>([]);

  const { mutateAsync: mutateAsyncPostRental, isLoading: isLoadingPostRental } =
    usePostRental({
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
            text={t("anyError")}
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
      base64={base64}
      isLoadingPostRental={isLoadingPostRental}
      isLoadingPosition={isLoadingLocation}
      position={position}
      pickImageByLibrary={pickImageByLibrary}
      getCurrentPosition={getCurrentPosition}
      postRental={postRental}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostRentalScreen;
