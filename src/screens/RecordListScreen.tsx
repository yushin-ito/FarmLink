import React, { useCallback, useEffect, useRef, useState } from "react";

import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import RecordListTemplate from "../components/templates/RecordListTemplate";
import { showAlert } from "../functions";
import { useQueryFarm } from "../hooks/farm/query";
import { useDeleteRecord } from "../hooks/record/mutate";
import { useInfiniteQueryRecords } from "../hooks/record/query";
import { supabase } from "../supabase";
import { FarmStackScreenProps, FarmStackParamList } from "../types";

const RecordScreen = ({ navigation }: FarmStackScreenProps<"RecordList">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const { params } = useRoute<RouteProp<FarmStackParamList, "RecordList">>();

  const focusRef = useRef(true);
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

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetchRecords();
    }, [])
  );

  useEffect(() => {
    refetchRecords();
  }, [asc]);

  const {
    mutateAsync: mutateAsyncDeleteRecord,
    isPending: isLoadingDeleteRecord,
  } = useDeleteRecord({
    onSuccess: async () => {
      await refetchRecords();
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
    navigation.navigate("PostRecord", { farmId: params.farmId });
  }, [params]);

  const editRecordNavigationHandler = useCallback((recordId: number) => {
    navigation.navigate("EditRecord", { recordId });
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
      editRecordNavigationHandler={editRecordNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default RecordScreen;
