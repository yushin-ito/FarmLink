import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCallback } from "react";

import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import FarmDetailTemplate from "../components/templates/FarmDetailTemplate";
import { showAlert, wait } from "../functions";
import { useQueryFarm } from "../hooks/farm/query";
import { usePostFarmLike, useDeleteFarmLike } from "../hooks/like/mutate";
import { useQueryFarmLikes } from "../hooks/like/query";
import { usePostNotification } from "../hooks/notification/mutate";
import useLocation from "../hooks/sdk/useLocation";
import useNotification from "../hooks/sdk/useNotification";
import { usePostTalk } from "../hooks/talk/mutate";
import { useQueryTalks } from "../hooks/talk/query";
import { useQueryUser } from "../hooks/user/query";
import { RootStackParamList, RootStackScreenProps } from "../types";

const FarmDetailScreen = ({ navigation }: RootStackScreenProps) => {
  const { t } = useTranslation("map");
  const toast = useToast();
  const { params } = useRoute<RouteProp<RootStackParamList, "FarmDetail">>();

  const focusRef = useRef(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const { data: user, isPending: isLoadingUser } = useQueryUser();
  const {
    data: farm,
    refetch: refetchFarm,
    isPending: isLoadingFarm,
  } = useQueryFarm(params.farmId);
  const {
    data: likes,
    refetch: refetchLikes,
    isPending: isLoadingLikes,
  } = useQueryFarmLikes(params.farmId);
  const { data: talks } = useQueryTalks();

  const liked = useMemo(
    () =>
      likes?.some(
        (item) => item.userId === user?.userId && item.farmId === params.farmId
      ) ?? false,
    [user, likes, params]
  );

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetchFarm();
      refetchLikes();
    }, [])
  );

  useEffect(() => {
    farm && getAddress(farm.latitude, farm.longitude);
  }, [farm]);

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
    usePostFarmLike({
      onSuccess: async () => {
        await refetchLikes();
        if (user && farm && user.userId !== farm.ownerId) {
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

  const { mutateAsync: mutateAsyncDeleteLike, isPending: isLoadingDeleteLike } =
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

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await refetchFarm();
    await refetchLikes();
    setIsRefetching(false);
  }, []);

  const postLike = useCallback(async () => {
    if (user) {
      await mutateAsyncPostLike({
        userId: user.userId,
        farmId: params.farmId,
      });
    }
  }, [user, params]);

  const deleteLike = useCallback(async () => {
    if (user) {
      await mutateAsyncDeleteLike({
        farmId: params.farmId,
        userId: user.userId,
      });
    }
  }, [user, params]);

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
    } else if (user && farm) {
      await mutateAsyncPostTalk({
        senderId: user.userId,
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
  }, [user, farm, talks]);

  const editFarmNavigationHandler = useCallback(async (farmId: number) => {
    navigation.navigate("EditFarm", { farmId });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <FarmDetailTemplate
      owned={user?.userId === farm?.ownerId}
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
