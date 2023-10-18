import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import FarmDetailTemplate from "../components/templates/FarmDetailTemplate";
import { MapStackParamList, MapStackScreenProps } from "../types";
import { useCallback } from "react";
import { useQueryFarm } from "../hooks/farm/query";
import { useQueryFarmLikes } from "../hooks/like/query";
import { showAlert, wait } from "../functions";
import { usePostFarmLike, useDeleteFarmLike } from "../hooks/like/mutate";
import useLocation from "../hooks/sdk/useLocation";
import { usePostTalk } from "../hooks/talk/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useQueryTalks } from "../hooks/talk/query";
import { usePostNotification } from "../hooks/notification/mutate";
import useNotification from "../hooks/sdk/useNotification";
import { useQueryUser } from "../hooks/user/query";

const FarmDetailScreen = ({
  navigation,
}: MapStackScreenProps<"FarmDetail">) => {
  const toast = useToast();
  const { t } = useTranslation("map");
  const { params } = useRoute<RouteProp<MapStackParamList, "FarmDetail">>();
  const {
    data: farm,
    refetch: refetchFarm,
    isLoading: isLoadingFarm,
  } = useQueryFarm(params.farmId);
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
  } = useQueryFarmLikes(params.farmId);
  const [isRefetching, setIsRefetching] = useState(false);
  const liked =
    likes?.some(
      (item) =>
        item.userId === session?.user.id && item.farmId === params.farmId
    ) ?? false;

  useEffect(() => {
    if (farm) {
      farm.latitude &&
        farm.longitude &&
        getAddress(farm.latitude, farm.longitude);
    }
  }, [farm]);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await refetchFarm();
    await refetchLikes();
    setIsRefetching(false);
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
    usePostFarmLike({
      onSuccess: async () => {
        await refetchLikes();
        if (user && farm && session?.user.id !== farm.ownerId) {
          await mutateAsyncPostNotification({
            recieverId: farm.ownerId,
            senderId: user.userId,
            farmId: params.farmId,
            clicked: false,
          });
          if (farm.owner.token && farm.name) {
            await sendNotification({
              to: farm.owner.token,
              title: farm.name,
              body: farm.name + "さんが" + user.name + "いいねしました。",
              data: {
                data: {
                  scheme: `TabNavigator/MapNavigator/Map?id=${params.farmId}&latitude=${farm.latitude}&longitude=${farm.longitude}&type=farm}`,
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
    useDeleteFarmLike({
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
        const talk = data?.find((item) => item.to.userId === farm?.ownerId);
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
        farmId: params.farmId,
      });
    }
  }, [params, session]);

  const deleteLike = useCallback(async () => {
    await mutateAsyncDeleteLike({
      farmId: params.farmId,
      userId: session?.user.id,
    });
  }, [params, session]);

  const talkChatNavigationHandler = useCallback(async () => {
    const talk = talks?.find((item) => item.to.userId === farm?.ownerId);
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
    } else if (session && farm) {
      await mutateAsyncPostTalk({
        senderId: session.user.id,
        recieverId: farm.ownerId,
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
  }, [talks, session, farm]);

  const editFarmNavigationHandler = useCallback(async (farmId: number) => {
    navigation.navigate("EditFarm", { farmId });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <FarmDetailTemplate
      owned={session?.user.id === farm?.ownerId}
      liked={liked}
      likes={likes}
      farm={farm}
      address={address}
      postLike={postLike}
      deleteLike={deleteLike}
      refetch={refetch}
      isLoading={
        isLoadingUser || isLoadingFarm || isLoadingLikes || isLoadingAddress
      }
      isLoadingPostTalk={isLoadingPostTalk}
      isLoadingPostLike={isLoadingPostLike || isLoadingPostNotification}
      isLoadingDeleteLike={isLoadingDeleteLike}
      isRefetching={isRefetching}
      editFarmNavigationHandler={editFarmNavigationHandler}
      talkChatNavigationHandler={talkChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default FarmDetailScreen;
