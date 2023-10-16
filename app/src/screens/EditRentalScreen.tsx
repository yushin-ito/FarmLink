import React, { useCallback, useEffect, useState } from "react";
import EditRentalTemplate from "../components/templates/EditRentalTemplate";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import {
  useUpdateRental,
  usePostRentalImage,
  useDeleteRental,
} from "../hooks/rental/mutate";
import { useTranslation } from "react-i18next";
import useLocation from "../hooks/sdk/useLocation";
import useImage from "../hooks/sdk/useImage";
import { useQueryRental } from "../hooks/rental/query";
import { MapStackScreenProps, MapStackParamList, Rate } from "../types";
import { supabase } from "../supabase";
import { useRoute, RouteProp } from "@react-navigation/native";

const EditRentalScreen = ({
  navigation,
}: MapStackScreenProps<"EditRental">) => {
  const toast = useToast();
  const { t } = useTranslation("map");
  const { params } = useRoute<RouteProp<MapStackParamList, "EditRental">>();
  const { data: rental, refetch: refetchRental } = useQueryRental(
    params.rentalId
  );
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    getPosition();
    rental?.imageUrls && setImages(rental.imageUrls);
  }, [rental]);

  const {
    mutateAsync: mutateAsyncUpdateRental,
    isLoading: isLoadingUpdateRental,
  } = useUpdateRental({
    onSuccess: async (data) => {
      await refetchRental();
      if (position && data?.length) {
        navigation.navigate("Map", {
          regionId: data[0].rentalId,
          latitude: position.latitude,
          longitude: position.longitude,
          type: "rental",
        });
      } else {
        showAlert(
          toast,
          <Alert
            status="success"
            onPressCloseButton={() => toast.closeAll()}
            text={t("saved")}
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
    mutateAsync: mutateAsyncDeleteRental,
    isLoading: isLoadingDeleteRental,
  } = useDeleteRental({
    onSuccess: async () => {
      navigation.goBack();
      navigation.goBack();
      await refetchRental();
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

  const { position, getPosition, address, getAddress, isLoadingPosition } =
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

  const {
    mutateAsync: mutateAsyncPostRentalImage,
    isLoading: isLoadingPostRentalImage,
  } = usePostRentalImage({
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
      isLoadingUpdateRental={isLoadingUpdateRental || isLoadingPostRentalImage}
      isLoadingDeleteRental={isLoadingDeleteRental}
      isLoadingPosition={isLoadingPosition}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditRentalScreen;
