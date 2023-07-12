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

const RentalDetailScreen = ({
  navigation,
}: MapStackScreenProps<"RentalDetail">) => {
  const toast = useToast();
  const { t } = useTranslation("map");
  const { params } = useRoute<RouteProp<MapStackParamList, "RentalDetail">>();
  const { data: rental } = useQueryRental(params.rentalId);
  const { session } = useAuth();
  const { data: talks, refetch } = useQueryTalks(session?.user.id);

  useEffect(() => {
    rental && getAddress(rental.latitude, rental.longitude);
  }, [rental]);

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
        const { data } = await refetch();
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
  }, [talks]);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RentalDetailTemplate
      owned={session?.user.id === rental?.ownerId}
      address={address}
      rental={rental}
      isLoadingPostTalk={isLoadingPostTalk}
      talkChatNavigationHandler={talkChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RentalDetailScreen;
