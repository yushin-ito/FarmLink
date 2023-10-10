import React, { useCallback, useEffect, useState } from "react";
import EditRentalTemplate from "../components/templates/EditRentalTemplate";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostRental, usePostRentalImage } from "../hooks/rental/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";
import useLocation from "../hooks/sdk/useLocation";
import useImage from "../hooks/sdk/useImage";
import { useQueryRental, useQueryRentals } from "../hooks/rental/query";
import { MapStackScreenProps, MapStackParamList } from "../types";
import { supabase } from "../supabase";
import { useRoute, RouteProp } from "@react-navigation/native";

const EditRentalScreen = ({
  navigation,
}: MapStackScreenProps<"EditRental">) => {
  const toast = useToast();
  const { t } = useTranslation("map");
  const { params } = useRoute<RouteProp<MapStackParamList, "EditRental">>();
  const { data: rental } = useQueryRental(
    params.rentalId
  );
  const { session } = useAuth();
  const { refetch } = useQueryRentals();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    rental?.imageUrls && setImages(rental.imageUrls);
  }, [rental]);

  const { mutateAsync: mutateAsyncPostRental, isLoading: isLoadingPostRental } =
    usePostRental({
      onSuccess: async () => {
        await refetch();
        navigation.goBack();
        showAlert(
          toast,
          <Alert
            status="success"
            onPressCloseButton={() => toast.closeAll()}
            text={t("saved")}
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
        setImages((prev) => [...prev, base64]);
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

  const { address, getAddress } = useLocation({
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
      if (session && rental) {
        const publicUrls = await Promise.all(
          images.map(async (item) => {
            if (item.indexOf("http") == -1) {
              const { path } = await mutateAsyncPostRentalImage(item);
              const { data } = supabase.storage
                .from("image")
                .getPublicUrl(path);
              return data.publicUrl;
            } else {
              return item;
            }
          })
        );
        await mutateAsyncPostRental({
          rentalId: rental.rentalId,
          name,
          description,
          ownerId: session.user.id,
          fee,
          area,
          equipment,
          imageUrls: publicUrls,
          privated: false,
        });
      }
    },
    [session, images]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EditRentalTemplate
      rental={rental}
      images={images}
      isLoadingPostRental={isLoadingPostRental || isLoadingPostRentalImage}
      address={address}
      pickImageByLibrary={pickImageByLibrary}
      getAddress={getAddress}
      postRental={postRental}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditRentalScreen;
