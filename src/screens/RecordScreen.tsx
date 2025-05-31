import React, { useCallback, useRef, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import RecordTemplate from "../components/templates/RecordTemplate";
import { showAlert } from "../functions";
import { useDeleteFarm } from "../hooks/farm/mutate";
import { useQueryUserFarms } from "../hooks/farm/query";
import { useDeleteRecord } from "../hooks/record/mutate";
import { useInfiniteQueryAgenda } from "../hooks/record/query";
import { useQueryUser } from "../hooks/user/query";
import { FarmStackScreenProps } from "../types";

const RecordScreen = ({ navigation }: FarmStackScreenProps<"Record">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();

  const focusRef = useRef(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const {
    data: farms,
    refetch: refetchFarms,
    isLoading: isLoadingFarms,
  } = useQueryUserFarms();
  const {
    data: agenda,
    isLoading: isLoadingAgenda,
    hasNextPage,
    fetchNextPage,
    refetch: refetchAgenda,
  } = useInfiniteQueryAgenda(farms?.map((farm) => farm.farmId));

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }

      refetchFarms();
      refetchAgenda();
    }, [])
  );

  const { mutateAsync: mutateAsyncDeleteFarm, isPending: isLoadingDeleteFarm } =
    useDeleteFarm({
      onSuccess: async () => {
        await refetchFarms();
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

  const {
    mutateAsync: mutateAsyncDeleteRecord,
    isPending: isLoadingDeleteRecord,
  } = useDeleteRecord({
    onSuccess: async () => {
      await refetchAgenda();
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

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    await refetchFarms();
    await refetchAgenda();
    setIsRefetching(false);
  }, []);

  const deleteFarm = useCallback(async (farmId: number) => {
    await mutateAsyncDeleteFarm(farmId);
  }, []);

  const deleteRecord = useCallback(async (recordId: number) => {
    await mutateAsyncDeleteRecord(recordId);
  }, []);

  const postFarmNavigationHandler = useCallback(() => {
    navigation.navigate("PostFarm");
  }, []);

  const editFarmNavigationHandler = useCallback((farmId: number) => {
    navigation.navigate("EditFarm", { farmId });
  }, []);

  const editRecordNavigationHandler = useCallback((recordId: number) => {
    navigation.navigate("EditRecord", { recordId });
  }, []);

  const recordListNavigationHandler = useCallback((farmId: number) => {
    navigation.navigate("RecordList", { farmId });
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("TabNavigator", {
      screen: "SettingNavigator",
      params: {
        screen: "Setting",
      },
    });
  }, []);

  return (
    <RecordTemplate
      user={user}
      farms={farms}
      agenda={agenda?.pages[0]}
      refetch={refetch}
      deleteFarm={deleteFarm}
      deleteRecord={deleteRecord}
      readMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoading={
        isLoadingUser ||
        isLoadingFarms ||
        isLoadingAgenda ||
        isLoadingDeleteFarm ||
        isLoadingDeleteRecord
      }
      isRefetching={isRefetching}
      recordListNavigationHandler={recordListNavigationHandler}
      postFarmNavigationHandler={postFarmNavigationHandler}
      editFarmNavigationHandler={editFarmNavigationHandler}
      editRecordNavigationHandler={editRecordNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
    />
  );
};

export default RecordScreen;
