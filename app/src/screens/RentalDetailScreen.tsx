import React, { useCallback, useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MapStackParamList, MapStackScreenProps } from "../types";
import RentalDetailTemplate from "../components/templates/RentalDetailTemplate";
import { useQueryRental } from "../hooks/rental/query";
import { showAlert, wait } from "../functions";
import { useQueryTalks } from "../hooks/talk/query";
import useAuth from "../hooks/auth/useAuth";
import { usePostTalk } from "../hooks/talk/mutate";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import useLocation from "../hooks/sdk/useLocation";
import { useQueryRentalLikes } from "../hooks/like/query";
import { useDeleteRentalLike, usePostRentalLike } from "../hooks/like/mutate";
import { usePostNotification } from "../hooks/notification/mutate";
import useNotification from "../hooks/sdk/useNotification";
import { useQueryUser } from "../hooks/user/query";

const RentalDetailScreen = ({
  navigation,
}: MapStackScreenProps<"RentalDetail">) => {
  const toast = useToast();
  const { t } = useTranslation("map");
  const { params } = useRoute<RouteProp<MapStackParamList, "RentalDetail">>();
  const {
    data: rental,
    isLoading: isLoadingRental,
    refetch: refetchRental,
  } = useQueryRental(params.rentalId);
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const { data: talks, refetch: refetchTalks } = useQueryTalks(
    session?.user.id
  );
  const {
    data: likes,
    refetch: refetchLikes,
    isLoading: isLoadingLikes,
  } = useQueryRentalLikes(params.rentalId);
  const [isRefetchingRental, setIsRefetchingRental] = useState(false);
  const liked =
    likes?.some(
      (item) =>
        item.userId === session?.user.id && item.rentalId === params.rentalId
    ) ?? false;

  useEffect(() => {
    rental?.latitude &&
      rental?.longitude &&
      getAddress(rental.latitude, rental.longitude);
  }, [rental]);

  const refetch = useCallback(async () => {
    setIsRefetchingRental(true);
    await refetchRental();
    await refetchLikes();
    setIsRefetchingRental(false);
  }, []);

  const {
    mutateAsync: mutateAsyncPostNotification,
    isLoading: isLoadingPostNotification,
  } = usePostNotification({
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

  const { mutateAsync: mutateAsyncPostLike, isLoading: isLoadingPostLike } =
    usePostRentalLike({
      onSuccess: async () => {
        await refetchLikes();
        if (user && rental) {
          await mutateAsyncPostNotification({
            recieverId: rental.ownerId,
            senderId: user.userId,
            rentalId: params.rentalId,
            clicked: false,
          });

          if (rental.user.token && rental.name) {
            await sendNotification({
              to: rental.user.token,
              title: rental.name,
              body: rental.name + t("to") + user.name + t("liked"),
              data: {
                data: {
                  scheme: `TabNavigator/MapNavigator/Map?id=${params.rentalId}&latitude=${rental.latitude}&longitude=${rental.longitude}&type=rental`,
                },
              },
            });
          }
        }
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

  const { mutateAsync: mutateAsyncDeleteLike, isLoading: isLoadingDeleteLike } =
    useDeleteRentalLike({
      onSuccess: async () => {
        await refetchLikes();
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

  const { address, getAddress, isLoadingAddress } = useLocation({
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

  const { mutateAsync: mutateAsyncPostTalk, isLoading: isLoadingPostTalk } =
    usePostTalk({
      onSuccess: async () => {
        const { data } = await refetchTalks();
        const talk = data?.find((item) => item.to.userId === rental?.ownerId);
        if (talk) {
          navigation.navigate("TabNavigator", {
            screen: "TalkNavigator",
            params: {
              screen: "TalkList",
            },
          });
          await wait(0.1);
          navigation.navigate("TabNavigator", {
            screen: "TalkNavigator",
            params: {
              screen: "TalkChat",
              params: {
                talkId: talk.talkId,
              },
            },
          });
        }
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

  const { sendNotification } = useNotification({
    onDisable: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("permitRequestNoti")}
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

  const postLike = useCallback(async () => {
    if (session) {
      await mutateAsyncPostLike({
        userId: session.user.id,
        rentalId: params.rentalId,
      });
    }
  }, [session]);

  const deleteLike = useCallback(async () => {
    await mutateAsyncDeleteLike(params.rentalId);
  }, []);

  const talkChatNavigationHandler = useCallback(async () => {
    const talk = talks?.find((item) => item.to.userId === rental?.ownerId);
    if (talk) {
      navigation.navigate("TabNavigator", {
        screen: "TalkNavigator",
        params: {
          screen: "TalkList",
        },
      });
      await wait(0.1);
      navigation.navigate("TabNavigator", {
        screen: "TalkNavigator",
        params: {
          screen: "TalkChat",
          params: {
            talkId: talk.talkId,
          },
        },
      });
    } else if (session && rental) {
      await mutateAsyncPostTalk({
        senderId: session.user.id,
        recieverId: rental.ownerId,
        lastMessage: t("createdTalk"),
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
  }, [talks, session, rental]);

  const editRentalNavigationHandler = useCallback(async (rentalId: number) => {
    navigation.goBack();
    navigation.navigate("EditRental", { rentalId });
  }, []);

  const imagePreviewNavigationHandler = useCallback(
    (title: string, imageUrl: string) => {
      navigation.navigate("ImagePreview", { title, imageUrl });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalDetailTemplate
      owned={session?.user.id === rental?.ownerId}
      liked={liked}
      likes={likes}
      postLike={postLike}
      deleteLike={deleteLike}
      refetch={refetch}
      address={address}
      rental={rental}
      isLoading={
        isLoadingUser || isLoadingRental || isLoadingLikes || isLoadingAddress
      }
      isLoadingPostTalk={isLoadingPostTalk}
      isLoadingPostLike={isLoadingPostLike || isLoadingPostNotification}
      isRefetching={isRefetchingRental}
      isLoadingDeleteLike={isLoadingDeleteLike}
      talkChatNavigationHandler={talkChatNavigationHandler}
      editRentalNavigationHandler={editRentalNavigationHandler}
      imagePreviewNavigationHandler={imagePreviewNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalDetailScreen;
