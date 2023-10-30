import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import RentalDetailTemplate from "../components/templates/RentalDetailTemplate";
import { showAlert, wait } from "../functions";
import { useDeleteRentalLike, usePostRentalLike } from "../hooks/like/mutate";
import { useQueryRentalLikes } from "../hooks/like/query";
import { usePostNotification } from "../hooks/notification/mutate";
import { useQueryRental } from "../hooks/rental/query";
import useLocation from "../hooks/sdk/useLocation";
import useNotification from "../hooks/sdk/useNotification";
import { usePostTalk } from "../hooks/talk/mutate";
import { useQueryTalks } from "../hooks/talk/query";
import { useQueryUser } from "../hooks/user/query";
import { RootStackParamList, RootStackScreenProps } from "../types";

const RentalDetailScreen = ({ navigation }: RootStackScreenProps) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { params } = useRoute<RouteProp<RootStackParamList, "RentalDetail">>();

  const focusRef = useRef(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const {
    data: rental,
    isLoading: isLoadingRental,
    refetch: refetchRental,
  } = useQueryRental(params.rentalId);
  const {
    data: likes,
    refetch: refetchLikes,
    isLoading: isLoadingLikes,
  } = useQueryRentalLikes(params.rentalId);
  const { data: talks } = useQueryTalks();

  const liked = useMemo(
    () =>
      likes?.some(
        (item) =>
          item.userId === user?.userId && item.rentalId === params.rentalId
      ) ?? false,
    [user, likes, params]
  );

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetchRental();
      refetchLikes();
    }, [])
  );

  useEffect(() => {
    rental && getAddress(rental.latitude, rental.longitude);
  }, [rental]);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await refetchRental();
    await refetchLikes();
    setIsRefetching(false);
  }, []);

  const {
    mutateAsync: mutateAsyncPostNotification,
    isPending: isLoadingPostNotification,
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

  const { mutateAsync: mutateAsyncPostLike, isPending: isLoadingPostLike } =
    usePostRentalLike({
      onSuccess: async () => {
        await refetchLikes();
        if (user && rental && user.userId !== rental.ownerId) {
          await mutateAsyncPostNotification({
            recieverId: rental.ownerId,
            senderId: user.userId,
            rentalId: params.rentalId,
            clicked: false,
          });
          if (rental.owner.token && rental.name) {
            await sendNotification({
              to: rental.owner.token,
              title: rental.name,
              body: rental.name + "さんが" + user.name + "いいねしました。",
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

  const { mutateAsync: mutateAsyncDeleteLike, isPending: isLoadingDeleteLike } =
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

  const { mutateAsync: mutateAsyncPostTalk, isPending: isLoadingPostTalk } =
    usePostTalk({
      onSuccess: async ({ talkId }) => {
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
              talkId,
            },
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
    if (user) {
      await mutateAsyncPostLike({
        userId: user.userId,
        rentalId: params.rentalId,
      });
    }
  }, [user, params]);

  const deleteLike = useCallback(async () => {
    if (user) {
      await mutateAsyncDeleteLike({
        rentalId: params.rentalId,
        userId: user.userId,
      });
    }
  }, [user, params]);

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
    } else if (user && rental) {
      await mutateAsyncPostTalk({
        senderId: user.userId,
        recieverId: rental.ownerId,
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
  }, [user, rental, talks]);

  const editRentalNavigationHandler = useCallback(async (rentalId: number) => {
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
      owned={user?.userId === rental?.ownerId}
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
      isRefetching={isRefetching}
      isLoadingDeleteLike={isLoadingDeleteLike}
      talkChatNavigationHandler={talkChatNavigationHandler}
      editRentalNavigationHandler={editRentalNavigationHandler}
      imagePreviewNavigationHandler={imagePreviewNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalDetailScreen;
