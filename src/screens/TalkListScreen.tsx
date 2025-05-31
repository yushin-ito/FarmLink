import React, { useState, useCallback, useRef } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import TalkListTemplate from "../components/templates/TalkListTemplate";
import { showAlert } from "../functions";
import { useDeleteTalk } from "../hooks/talk/mutate";
import { useQueryTalks } from "../hooks/talk/query";
import { useQueryUser } from "../hooks/user/query";
import { TalkStackScreenProps } from "../types";

const TalkListScreen = ({ navigation }: TalkStackScreenProps<"TalkList">) => {
  const { t } = useTranslation("talk");
  const toast = useToast();

  const focusRef = useRef(true);
  const [isRefetchingTalks, setIsRefetchingTalks] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const { data: talks, refetch, isLoading: isLoadingTalks } = useQueryTalks();

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetch();
    }, [])
  );

  const { mutateAsync: mutateAsyncDeleteTalk, isPending: isLoadingDeleteTalk } =
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
      refetchTalks={refetchTalks}
      deleteTalk={deleteTalk}
      isLoading={isLoadingUser || isLoadingTalks || isLoadingDeleteTalk}
      isRefetchingTalks={isRefetchingTalks}
      talkChatNavigationHandler={talkChatNavigationHandler}
      postTalkNavigationHandler={postTalkNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
      searchTalkNavigationHandler={searchTalkNavigationHandler}
    />
  );
};

export default TalkListScreen;
