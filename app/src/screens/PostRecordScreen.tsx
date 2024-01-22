import React, { useCallback } from "react";

import { useNavigation } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostRecordTemplate from "../components/templates/PostRecordTemplate";
import { showAlert } from "../functions";
import { usePostRecord } from "../hooks/record/mutate";
import { Weather } from "../types";

const PostProfileScreen = () => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const navigation = useNavigation();

  const {
    mutateAsync: mutateAsyncPostProfile,
    isPending: isLoadingPostRecord,
  } = usePostRecord({
    onSuccess: () => {
      navigation.goBack();
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

  const postRecord = useCallback(
    async (
      weather: Weather,
      work: string,
      note: string,
      pesticide: string,
      ratio: number,
      amount: string
    ) => {
      await mutateAsyncPostProfile({
        weather,
        work,
        note,
        pesticide,
        ratio,
        amount,
      });
    },
    []
  );
  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostRecordTemplate
      postRecord={postRecord}
      isLoadingPostRecord={isLoadingPostRecord}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostProfileScreen;
