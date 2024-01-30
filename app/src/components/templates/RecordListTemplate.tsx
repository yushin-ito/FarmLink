import React, { Dispatch, SetStateAction } from "react";
import { Alert, RefreshControl } from "react-native";

import { Feather } from "@expo/vector-icons";
import {
  Box,
  Icon,
  FlatList,
  Text,
  useColorModeValue,
  Center,
  Spinner,
  HStack,
  Heading,
  IconButton,
  Pressable,
} from "native-base";
import { useTranslation } from "react-i18next";

import { GetFarmResponse } from "../../hooks/farm/query";
import { GetRecordsResponse } from "../../hooks/record/query";
import Fab from "../molecules/Fab";
import Overlay from "../molecules/Overlay";
import RecordListItem from "../organisms/RecordListItem";
import SkeletonRecordList from "../organisms/SkeletonRecordList";

type RecordListTemplateProps = {
  asc: boolean;
  setAsc: Dispatch<SetStateAction<boolean>>;
  farm: GetFarmResponse | undefined;
  records: GetRecordsResponse | undefined;
  refetchRecords: () => Promise<void>;
  deleteRecord: (recordId: number) => Promise<void>;
  getExcelSheet: () => Promise<void>;
  readMore: () => void;
  hasMore: boolean | undefined;
  isLoading: boolean;
  isLoadingDeleteRecord: boolean;
  isRefetching: boolean;
  postRecordNavigationHandler: () => void;
  editRecordNavigationHandler: (recordId: number) => void;
  goBackNavigationHandler: () => void;
};

const RecordListTemplate = ({
  asc,
  setAsc,
  farm,
  records,
  refetchRecords,
  deleteRecord,
  getExcelSheet,
  readMore,
  hasMore,
  isLoading,
  isLoadingDeleteRecord,
  isRefetching,
  postRecordNavigationHandler,
  editRecordNavigationHandler,
  goBackNavigationHandler,
}: RecordListTemplateProps) => {
  const { t } = useTranslation("farm");

  const bgColor = useColorModeValue("muted.200", "muted.700");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Box flex={1} safeAreaTop>
      <Overlay isOpen={isLoadingDeleteRecord} />
      <HStack pt="2" px="2" alignItems="center" justifyContent="space-between">
        <HStack alignItems="center">
          <IconButton
            onPress={goBackNavigationHandler}
            icon={
              <Icon
                as={<Feather name="chevron-left" />}
                size="2xl"
                color={iconColor}
              />
            }
            variant="unstyled"
          />
          <Heading fontSize="xl">{farm?.name}</Heading>
        </HStack>
        <Pressable
          onPress={() => {
            getExcelSheet();
          }}
        >
          <Text mr="4" fontSize="md" bold>
            {t("submit")}
          </Text>
        </Pressable>
      </HStack>
      <Pressable
        onPress={() => setAsc(!asc)}
        alignSelf="flex-end"
        my="2"
        mr="8"
      >
        <HStack
          alignItems="center"
          pl="2"
          pr="3"
          py="1"
          space="0.5"
          rounded="full"
          bg={bgColor}
        >
          <Icon
            as={<Feather />}
            name={asc ? "arrow-up" : "arrow-down"}
            size="sm"
            color={iconColor}
          />
          <Text>{t(asc ? "asc" : "desc")}</Text>
        </HStack>
      </Pressable>
      {isLoading ? (
        <SkeletonRecordList rows={8} />
      ) : (
        <FlatList
          onEndReached={readMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            <Center mt="5">{hasMore && <Spinner color="muted.400" />}</Center>
          }
          w="100%"
          data={records}
          ListEmptyComponent={
            <Text
              bold
              lineHeight="2xl"
              fontSize="md"
              textAlign="center"
              color={textColor}
            >
              {t("notExistRecord")}
            </Text>
          }
          renderItem={({ item }) => (
            <RecordListItem
              item={item}
              onPress={() => {}}
              onPressLeft={() => editRecordNavigationHandler(item.recordId)}
              onPressRight={() => {
                Alert.alert(t("deleteRecord"), t("askDeleteRecord"), [
                  {
                    text: t("cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("delete"),
                    onPress: async () => await deleteRecord(item.recordId),
                    style: "destructive",
                  },
                ]);
              }}
            />
          )}
          keyExtractor={(item) => item.recordId.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetchRecords}
              tintColor={spinnerColor}
            />
          }
        />
      )}
      <Fab
        position="absolute"
        bottom="12"
        right="6"
        onPress={postRecordNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </Fab>
    </Box>
  );
};

export default RecordListTemplate;
