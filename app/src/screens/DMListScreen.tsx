import React, { useState, useCallback } from "react";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useInfiniteQueryDMs } from "../hooks/dm/query";
import { useDeleteDM } from "../hooks/dm/mutate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import { DMStackParamList } from "../types";
import DMListTemplate from "../components/templates/DMListTemplate";

type DMListNavigationProp = NativeStackNavigationProp<
  DMStackParamList,
  "DMList"
>;

const DMListScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("dm");
  const navigation = useNavigation<DMListNavigationProp>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const {
    data: dms,
    isLoading: isLoadingDMs,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryDMs();
  const [isRefetchingDMs, setIsRefetchingDMs] = useState(false);

  const { mutateAsync: mutateAsyncDeleteDM } = useDeleteDM({
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
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

  const refetchDM = useCallback(async () => {
    setIsRefetchingDMs(true);
    await refetch();
    setIsRefetchingDMs(false);
  }, []);

  const deleteDM = useCallback(async (DMId: number) => {
    await mutateAsyncDeleteDM(DMId);
  }, []);

  const DMChatNavigationHandler = useCallback(
    (dmId: number, dmName: string | null) => {
      navigation.navigate("DMChat", { dmId, dmName });
    },
    []
  );

  const postDMNavigationHandler = useCallback(() => {
    navigation.navigate("PostDM");
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("SettingNavigator", { screen: "Setting" });
  }, []);

  const searchDMNavigationHandler = useCallback(() => {
    navigation.navigate("SearchDM");
  }, []);

  return (
    <DMListTemplate
      dms={dms}
      user={user}
      isLoadingDMs={isLoadingDMs}
      isRefetchingDMs={isRefetchingDMs}
      hasMore={hasNextPage}
      readMore={fetchNextPage}
      refetchDMs={refetchDM}
      deleteDM={deleteDM}
      dmChatNavigationHandler={DMChatNavigationHandler}
      postDMNavigationHandler={postDMNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
      searchDMNavigationHandler={searchDMNavigationHandler}
    />
  );
};

export default DMListScreen;
