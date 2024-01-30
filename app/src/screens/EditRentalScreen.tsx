import React, { useCallback, useEffect, useState } from "react";

import { useRoute, RouteProp } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import EditRentalTemplate from "../components/templates/EditRentalTemplate";
import { showAlert } from "../functions";
import {
  useUpdateRental,
  usePostRentalImage,
  useDeleteRental,
} from "../hooks/rental/mutate";
import { useQueryRental } from "../hooks/rental/query";
import useImage from "../hooks/sdk/useImage";
import useLocation from "../hooks/sdk/useLocation";
import { supabase } from "../supabase";
import { Rate, RootStackScreenProps, RootStackParamList } from "../types";

const EditRentalScreen = ({ navigation }: RootStackScreenProps) => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const { params } = useRoute<RouteProp<RootStackParamList, "EditRental">>();

  const [images, setImages] = useState<string[]>([]);

  const { data: rental, isLoading: isLoadingRental } = useQueryRental(
    params.rentalId
  );

  useEffect(() => {
    getPosition();
    rental?.imageUrls && setImages(rental.imageUrls);
  }, [rental]);

  const {
    mutateAsync: mutateAsyncUpdateRental,
    isPending: isLoadingUpdateRental,
  } = useUpdateRental({
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

  const {
    mutateAsync: mutateAsyncDeleteRental,
    isPending: isLoadingDeleteRental,
  } = useDeleteRental({
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

  const updateRental = useCallback(
    async (
      name: string,
      description: string,
      fee: number,
      area: number,
      equipment: string,
      rate: Rate
    ) => {
      if (rental && position) {
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
        await mutateAsyncUpdateRental({
          rentalId: rental.rentalId,
          name,
          description,
          fee,
          area,
          equipment,
          imageUrls: publicUrls,
          rate,
          latitude: position.latitude,
          longitude: position.longitude,
          location: `POINT(${position.longitude} ${position.latitude})`,
        });
      }
    },
    [rental, images, position]
  );

  const deleteRental = useCallback(async () => {
    await mutateAsyncDeleteRental(params.rentalId);
  }, [params]);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <EditRentalTemplate
      rental={rental}
      images={images}
      position={position}
      address={address}
      pickImageByLibrary={pickImageByLibrary}
      getAddress={getAddress}
      updateRental={updateRental}
      deleteRental={deleteRental}
      isLoading={isLoadingRental}
      isLoadingUpdateRental={isLoadingUpdateRental || isLoadingPostRentalImage}
      isLoadingDeleteRental={isLoadingDeleteRental}
      isLoadingPosition={isLoadingPosition}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditRentalScreen;
