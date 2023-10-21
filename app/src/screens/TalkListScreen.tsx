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
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const {
    data: talks,
    isLoading: isLoadingTalks,
    refetch,
  } = useQueryTalks(session?.user.id);
  const [isRefetchingTalks, setIsRefetchingTalks] = useState(false);

  const { mutateAsync: mutateAsyncDeleteTalk, isLoading: isLoadingDeleteTalk } =
    useDeleteTalk({
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

  const talkChatNavigationHandler = useCallback((talkId: number) => {
    navigation.navigate("TalkChat", { talkId });
  }, []);

  const postTalkNavigationHandler = useCallback(() => {
    navigation.navigate("PostTalk");
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("TabNavigator", {
      screen: "SettingNavigator",
      params: {
        screen: "Setting",
      },
    });
  }, []);

  const searchTalkNavigationHandler = useCallback(() => {
    navigation.navigate("SearchTalk");
  }, []);

  return (
    <TalkListTemplate
      talks={talks}
      user={user}
      isLoading={isLoadingUser || isLoadingTalks || isLoadingDeleteTalk}
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
