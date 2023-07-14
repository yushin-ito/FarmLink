import React, { useCallback, useEffect } from "react";
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

const RentalDetailScreen = ({
  navigation,
}: MapStackScreenProps<"RentalDetail">) => {
  const toast = useToast();
  const { t } = useTranslation("map");
  const { params } = useRoute<RouteProp<MapStackParamList, "RentalDetail">>();
  const { data: rental, isRefetching: isRefetchingRental } = useQueryRental(
    params.rentalId
  );
  const { session } = useAuth();
  const { data: talks, refetch: refetchTalks } = useQueryTalks(
    session?.user.id
  );
  const { data: likes, refetch: refetchLikes } = useQueryRentalLikes(
    params.rentalId
  );
  const liked =
    likes?.some(
      (item) =>
        item.userId === session?.user.id && item.rentalId === params.rentalId
    ) ?? false;

  useEffect(() => {
    rental && getAddress(rental.latitude, rental.longitude);
  }, [rental]);

  const { mutateAsync: mutateAsyncPostLike, isLoading: isLoadingPostLike } =
    usePostRentalLike({
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

  const { address, getAddress } = useLocation({
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
              params: { talkId: talk.talkId, name: talk.to.name },
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

  const talkChatNavigationHandler = useCallback(async () => {
    const talk = talks?.find((item) => item.to.userId === rental?.ownerId);
    if (talk && talk.talkId && talk.to.name) {
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
          params: { talkId: talk.talkId, name: talk.to.name },
        },
      });
    } else if (session?.user.id && rental?.ownerId) {
      await mutateAsyncPostTalk({
        senderId: session.user.id,
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
  }, [talks, session?.user, rental]);

  const postLike = useCallback(async () => {
    session &&
      (await mutateAsyncPostLike({
        userId: session.user.id,
        rentalId: params.rentalId,
      }));
  }, [session?.user]);

  const deleteLike = useCallback(async () => {
    await mutateAsyncDeleteLike(params.rentalId);
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalDetailTemplate
      liked={liked}
      likes={likes}
      postLike={postLike}
      deleteLike={deleteLike}
      owned={session?.user.id === rental?.ownerId}
      address={address}
      rental={rental}
      isRefetchingRental={isRefetchingRental}
      isLoadingPostTalk={isLoadingPostTalk}
      isLoadingLike={isLoadingPostLike || isLoadingDeleteLike}
      talkChatNavigationHandler={talkChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalDetailScreen;
