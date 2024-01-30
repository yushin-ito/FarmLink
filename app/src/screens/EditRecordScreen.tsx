import React, { useCallback } from "react";

import { useRoute, RouteProp } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import EditRecordTemplate from "../components/templates/EditRecordTemplate";
import { showAlert } from "../functions";
import { useUpdateRecord } from "../hooks/record/mutate";
import { useQueryRecord } from "../hooks/record/query";
import { RootStackParamList, RootStackScreenProps, Weather } from "../types";

const EditRecordScreen = ({ navigation }: RootStackScreenProps) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { params } = useRoute<RouteProp<RootStackParamList, "EditRecord">>();

  const { data: record, isLoading: isLoadingRecord } = useQueryRecord(
    params.recordId
  );

  const {
    mutateAsync: mutateAsyncEditRecord,
    isPending: isLoadingUpdateRecord,
  } = useUpdateRecord({
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

  const updateRecord = useCallback(
    async (
      weather: Weather,
      work: string,
      note: string,
      pesticide: string,
      ratio: number,
      amount: string
    ) => {
      await mutateAsyncEditRecord({
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
    <EditRecordTemplate
      record={record}
      updateRecord={updateRecord}
      isLoading={isLoadingRecord}
      isLoadingUpdateRecord={isLoadingUpdateRecord}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default EditRecordScreen;
