import React, { useState, useCallback } from "react";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useQueryTalks } from "../hooks/talk/query";
import { useDeleteTalk } from "../hooks/talk/mutate";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import { TalkStackScreenProps } from "../types";
import TalkListTemplate from "../components/templates/TalkListTemplate";

const TalkListScreen = ({ navigation }: TalkStackScreenProps<"TalkList">) => {
  const toast = useToast();
  const { t } = useTranslation("talk");
  const { session, locale } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const {
    data: talks,
    isLoading: isLoadingTalks,
    refetch,
  } = useQueryTalks(session?.user.id);
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
          text={t("error")}
        />
      );
    },
  });

  const refetchTalks = useCallback(async () => {
    setIsRefetchingTalks(true);
    await refetch();
    setIsRefetchingTalks(false);
  }, []);

  const deleteTalk = useCallback(async (talkId: number) => {
    await mutateAsyncDeleteTalk(talkId);
  }, []);

  const talkChatNavigationHandler = useCallback(
    (talkId: number, name: string | null | undefined) => {
      navigation.navigate("TalkChat", { talkId, name });
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
      locale={locale}
      talks={talks}
      user={user}
      isLoadingTalks={isLoadingTalks}
      isRefetchingTalks={isRefetchingTalks}
      refetchTalks={refetchTalks}
      deleteTalk={deleteTalk}
      talkChatNavigationHandler={talkChatNavigationHandler}
      postTalkNavigationHandler={postTalkNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
      searchTalkNavigationHandler={searchTalkNavigationHandler}
    />
  );
};

export default TalkListScreen;
