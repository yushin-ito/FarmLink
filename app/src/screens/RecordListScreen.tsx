import React, { useCallback, useState } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import RecordListTemplate from "../components/templates/RecordListTemplate";
import { showAlert } from "../functions";
import { useDeleteFarm } from "../hooks/farm/mutate";
import { useQueryFarm } from "../hooks/farm/query";
import { useInfiniteQueryRecords } from "../hooks/record/query";
import { supabase } from "../supabase";
import { FarmStackScreenProps, FarmStackParamList } from "../types";

const RecordScreen = ({ navigation }: FarmStackScreenProps<"RecordList">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { params } = useRoute<RouteProp<FarmStackParamList, "RecordList">>();

  const [asc, setAsc] = useState<boolean>(true);

  const {
    data: farm,
    refetch: refetchFarm,
    isPending: isLoadingFarm,
  } = useQueryFarm(params.farmId);
  const {
    data: records,
    isLoading: isLoadingRecords,
    hasNextPage,
    fetchNextPage,
    refetch: refetchRecords,
  } = useInfiniteQueryRecords(asc ? "asc" : "desc", params.farmId);

  const [isRefetching, setIsRefetching] = useState(false);

  const {
    mutateAsync: mutateAsyncDeleteRecord,
    isPending: isLoadingDeleteRecord,
  } = useDeleteFarm({
    onSuccess: async () => {
      await refetchRecords();
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="success"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const getExcelSheet = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("get-excel-sheet");
    console.log(data, error);
  }, []);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    refetchFarm();
    refetchRecords();
    setIsRefetching(false);
  }, []);

  const deleteRecord = useCallback(async (recordId: number) => {
    await mutateAsyncDeleteRecord(recordId);
  }, []);

  const postRecordNavigationHandler = useCallback(() => {
    navigation.navigate("PostRecord");
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <RecordListTemplate
      asc={asc}
      setAsc={setAsc}
      farm={farm}
      records={records?.pages[0]}
      deleteRecord={deleteRecord}
      refetchRecords={refetch}
      getExcelSheet={getExcelSheet}
      readMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoading={isLoadingFarm || isLoadingRecords}
      isLoadingDeleteRecord={isLoadingDeleteRecord}
      isRefetching={isRefetching}
      postRecordNavigationHandler={postRecordNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RecordScreen;
