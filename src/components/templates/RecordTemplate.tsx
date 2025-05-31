import React, { useCallback, useState } from "react";
import {
  Alert,
  DefaultSectionT,
  RefreshControl,
  SectionListRenderItemInfo,
  useWindowDimensions,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import {
  Box,
  Icon,
  HStack,
  FlatList,
  useColorModeValue,
  Text,
  Heading,
  VStack,
  Center,
  Spinner,
} from "native-base";
import { useTranslation } from "react-i18next";
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  LocaleConfig,
} from "react-native-calendars";
import { TabBar, TabView } from "react-native-tab-view";

import { GetUserFarmsResponse } from "../../hooks/farm/query";
import {
  GetAgendaResponse,
  GetRecordsResponse,
} from "../../hooks/record/query";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import Fab from "../molecules/Fab";
import FarmListItem from "../organisms/FarmListItem";
import RecordListItem from "../organisms/RecordListItem";
import SkeletonFarmList from "../organisms/SkeletonFarmList";
import SkeletonRecordList from "../organisms/SkeletonRecordList";

type Scene = "list" | "calendar";

const scenes = ["list", "calendar"] as Scene[];

type FarmListProps = {
  farms: GetUserFarmsResponse | undefined;
  refetch: () => Promise<void>;
  deleteFarm: (farmId: number) => Promise<void>;
  isLoading: boolean;
  isRefetching: boolean;
  recordListNavigationHandler: (farmId: number) => void;
  postFarmNavigationHandler: () => void;
  editFarmNavigationHandler: (farmId: number) => void;
};

const FarmList = ({
  farms,
  refetch,
  deleteFarm,
  isLoading,
  isRefetching,
  recordListNavigationHandler,
  postFarmNavigationHandler,
  editFarmNavigationHandler,
}: FarmListProps) => {
  const { t } = useTranslation("farm");

  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const textColor = useColorModeValue("muted.600", "muted.300");

  return isLoading ? (
    <SkeletonFarmList rows={3} />
  ) : (
    <Box flex={1}>
      <FlatList
        mb="20"
        data={farms}
        renderItem={({ item }) => (
          <FarmListItem
            item={item}
            onPress={() => recordListNavigationHandler(item.farmId)}
            onPressLeft={() => editFarmNavigationHandler(item.farmId)}
            onPressRight={() =>
              Alert.alert(t("deleteFarm"), t("askDeleteFarm"), [
                {
                  text: t("cancel"),
                  style: "cancel",
                },
                {
                  text: t("delete"),
                  onPress: () => deleteFarm(item.farmId),
                  style: "destructive",
                },
              ])
            }
          />
        )}
        ListEmptyComponent={
          <Text
            mt="5"
            bold
            lineHeight="2xl"
            fontSize="md"
            textAlign="center"
            color={textColor}
          >
            {t("notExistFarm")}
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={spinnerColor}
          />
        }
      />
      <Fab
        position="absolute"
        bottom="24"
        right="6"
        onPress={postFarmNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </Fab>
    </Box>
  );
};

type CalendarProps = {
  agenda: GetAgendaResponse | undefined;
  deleteRecord: (recordId: number) => Promise<void>;
  hasMore: boolean | undefined;
  readMore: () => void;
  isLoading: boolean;
  editRecordNavigationHandler: (recordId: number) => void;
};

const Calendar = ({
  agenda,
  deleteRecord,
  hasMore,
  readMore,
  isLoading,
  editRecordNavigationHandler,
}: CalendarProps) => {
  const { t } = useTranslation(["farm", "app"]);

  const colorScheme = useColorModeValue("light", "dark");
  const backgroundColor = useColorModeValue("white", "#171717");
  const textColor = useColorModeValue("#525252", "#d4d4d4");
  const dayTextColor = useColorModeValue("black", "white");
  const monthTextColor = useColorModeValue("black", "white");

  const renderItem = useCallback(
    (
      info: SectionListRenderItemInfo<
        GetRecordsResponse | null,
        DefaultSectionT
      >
    ) => {
      return isLoading ? (
        <SkeletonRecordList rows={8} />
      ) : info.item?.length ? (
        <VStack>
          {info.item.map((item, index) => (
            <RecordListItem
              key={index}
              item={item}
              onPress={() => {}}
              onPressLeft={() => editRecordNavigationHandler(item.recordId)}
              onPressRight={() =>
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
                ])
              }
            />
          ))}
        </VStack>
      ) : (
        <Center h="20">
          <Text fontSize="sm" bold color={textColor}>
            {t("notExistRecord")}
          </Text>
        </Center>
      );
    },
    []
  );

  LocaleConfig.locales.en = LocaleConfig.locales[""];
  LocaleConfig.locales.ja = {
    monthNames: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    monthNamesShort: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    dayNames: [
      "日曜日",
      "月曜日",
      "火曜日",
      "水曜日",
      "木曜日",
      "金曜日",
      "土曜日",
    ],
    dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
  };
  LocaleConfig.defaultLocale = t("app:locale");

  return (
    <CalendarProvider date={new Date().toDateString()}>
      <ExpandableCalendar
        key={colorScheme}
        markedDates={agenda?.reduce((accum, value) => {
          return { ...accum, [value.title]: { marked: value.data[0] != null } };
        }, {})}
        markingType="dot"
        hideArrows
        allowShadow={false}
        closeOnDayPress={false}
        firstDay={1}
        theme={{
          textDayFontWeight: "500",
          textMonthFontWeight: "500",
          selectedDayBackgroundColor: "#75a43b",
          todayTextColor: "#75a43b",
          dotColor: "#75a43b",
          calendarBackground: backgroundColor,
          dayTextColor,
          monthTextColor,
          textSectionTitleColor: "#a3a3a3",
        }}
      />
      <AgendaList
        markToday={false}
        dayFormatter={(date) =>
          format(new Date(date), "PPP (E)", {
            locale: t("app:locale") === "en" ? enUS : ja,
          })
        }
        renderItem={renderItem}
        onEndReached={readMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          <Center mt={hasMore ? "4" : "12"}>
            {hasMore && <Spinner color="muted.400" />}
          </Center>
        }
        sections={agenda ?? []}
        sectionStyle={{ color: textColor, backgroundColor }}
      />
    </CalendarProvider>
  );
};

type RecordTemplateProps = {
  user: GetUserResponse | undefined;
  farms: GetUserFarmsResponse | undefined;
  agenda: GetAgendaResponse | undefined;
  refetch: () => Promise<void>;
  deleteFarm: (farmId: number) => Promise<void>;
  deleteRecord: (recordId: number) => Promise<void>;
  readMore: () => void;
  hasMore: boolean | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  recordListNavigationHandler: (farmId: number) => void;
  postFarmNavigationHandler: () => void;
  editFarmNavigationHandler: (farmId: number) => void;
  editRecordNavigationHandler: (recordId: number) => void;
  settingNavigationHandler: () => void;
};

const RecordTemplate = ({
  user,
  farms,
  agenda,
  refetch,
  deleteFarm,
  deleteRecord,
  readMore,
  hasMore,
  isLoading,
  isRefetching,
  recordListNavigationHandler,
  postFarmNavigationHandler,
  editFarmNavigationHandler,
  editRecordNavigationHandler,
  settingNavigationHandler,
}: RecordTemplateProps) => {
  const { t } = useTranslation("farm");

  const bgColor = useColorModeValue("white", "#171717");
  const borderColor = useColorModeValue("#d4d4d4", "#525252");
  const textColor = useColorModeValue("#525252", "white");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { width } = useWindowDimensions();
  const [routes] = useState(
    scenes.map((scene) => ({ key: scene, title: scene }))
  );
  const [sceneIndex, setSceneIndex] = useState(0);

  const renderScene = ({
    route,
  }: {
    route: {
      key: Scene;
      title: string;
    };
  }) =>
    route.key === "list" ? (
      <FarmList
        farms={farms}
        refetch={refetch}
        deleteFarm={deleteFarm}
        isLoading={isLoading}
        isRefetching={isRefetching}
        recordListNavigationHandler={recordListNavigationHandler}
        postFarmNavigationHandler={postFarmNavigationHandler}
        editFarmNavigationHandler={editFarmNavigationHandler}
      />
    ) : (
      <Calendar
        agenda={agenda}
        hasMore={hasMore}
        readMore={readMore}
        deleteRecord={deleteRecord}
        isLoading={isLoading}
        editRecordNavigationHandler={editRecordNavigationHandler}
      />
    );

  return (
    <Box flex={1} safeAreaTop>
      <VStack space="3" px="8" pt="6" pb="4">
        <HStack alignItems="center" justifyContent="space-between">
          <Heading>{t("record")}</Heading>
          <Avatar
            text={user?.name?.charAt(0)}
            uri={user?.avatarUrl}
            color={user?.color}
            updatedAt={user?.updatedAt}
            onPress={settingNavigationHandler}
            isLoading={isLoading}
          />
        </HStack>
      </VStack>
      <TabView
        lazy
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              borderBottomWidth: 3,
              borderBottomColor: "#75a43b",
              borderRadius: 2,
            }}
            renderLabel={({ route }) => (
              <Icon
                as={<Feather />}
                size="md"
                name={route.title}
                color={iconColor}
              />
            )}
            style={{
              backgroundColor: bgColor,
            }}
            tabStyle={{
              minHeight: 40,
              paddingBottom: 12,
              borderBottomWidth: 0.5,
              borderBottomColor: borderColor,
            }}
            activeColor="#75a43b"
            inactiveColor={textColor}
            pressColor="transparent"
          />
        )}
        navigationState={{ index: sceneIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setSceneIndex}
        initialLayout={{ height: 0, width }}
      />
    </Box>
  );
};

export default RecordTemplate;
