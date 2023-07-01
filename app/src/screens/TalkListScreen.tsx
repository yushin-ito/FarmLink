import React, { useState, useCallback } from "react";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useInfiniteQueryTalks } from "../hooks/talk/query";
import { useDeleteTalk } from "../hooks/talk/mutate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import { TalkStackParamList } from "../types";
import TalkListTemplate from "../components/templates/TalkListTemplate";

type TalkListNavigationProp = NativeStackNavigationProp<
  TalkStackParamList,
  "TalkList"
>;

const TalkListScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("talk");
  const navigation = useNavigation<TalkListNavigationProp>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const {
    data: talks,
    isLoading: isLoadingTalks,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryTalks();
  const [isRefetchingTalks, setIsRefetchingTalks] = useState(false);

  const { mutateAsync: mutateAsyncDeleteTalk } = useDeleteTalk({
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

  const refetchTalk = useCallback(async () => {
    setIsRefetchingTalks(true);
    await refetch();
    setIsRefetchingTalks(false);
  }, []);

  const deleteTalk = useCallback(async (talkId: number) => {
    await mutateAsyncDeleteTalk(talkId);
  }, []);

  const talkChatNavigationHandler = useCallback(
    (talkId: number, displayName: string | null | undefined) => {
      navigation.navigate("TalkChat", { talkId, displayName });
    },
    []
  );

  const postTalkNavigationHandler = useCallback(() => {
    navigation.navigate("PostTalk");
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("SettingNavigator", { screen: "Setting" });
  }, []);

  const searchTalkNavigationHandler = useCallback(() => {
    navigation.navigate("SearchTalk");
  }, []);

  return (
    <TalkListTemplate
      talks={talks}
      user={user}
      isLoadingTalks={isLoadingTalks}
      isRefetchingTalks={isRefetchingTalks}
      hasMore={hasNextPage}
      readMore={fetchNextPage}
      refetchTalks={refetchTalk}
      deleteTalk={deleteTalk}
      talkChatNavigationHandler={talkChatNavigationHandler}
      postTalkNavigationHandler={postTalkNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
      searchTalkNavigationHandler={searchTalkNavigationHandler}
    />
  );
};

export default TalkListScreen;
