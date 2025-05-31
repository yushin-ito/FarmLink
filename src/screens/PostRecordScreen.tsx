import React, { useCallback } from "react";

import { useRoute, RouteProp } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostRecordTemplate from "../components/templates/PostRecordTemplate";
import { showAlert } from "../functions";
import { usePostRecord } from "../hooks/record/mutate";
import { FarmStackParamList, FarmStackScreenProps, Weather } from "../types";

const PostRecordScreen = ({
  navigation,
}: FarmStackScreenProps<"PostRecord">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { params } = useRoute<RouteProp<FarmStackParamList, "PostRecord">>();

  const { mutateAsync: mutateAsyncPostRecord, isPending: isLoadingPostRecord } =
    usePostRecord({
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
      await mutateAsyncPostRecord({
        farmId: params.farmId,
        weather,
        work,
        note,
        pesticide,
        ratio,
        amount,
      });
    },
    [params]
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

export default PostRecordScreen;
