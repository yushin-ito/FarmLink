import {
  Box,
  VStack,
  HStack,
  Heading,
  Icon,
  FlatList,
  Text,
  useColorModeValue,
} from "native-base";
import React from "react";
import Fab from "../molecules/Fab";
import FarmItem from "../organisms/FarmItem";
import { GetUserFarmsResponse } from "../../hooks/farm/query";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import SkeletonFarmList from "../organisms/SkeletonFarmList";
import { Alert, RefreshControl } from "react-native";

type FarmListTemplateProps = {
  user: GetUserResponse | null | undefined;
  farms: GetUserFarmsResponse | null | undefined;
  isLoading: boolean;
  isRefetchingFarms: boolean;
  refetchFarms: () => Promise<void>;
  deleteFarm: (farmId: number) => Promise<void>;
  privateFarm: (farmId: number) => Promise<void>;
  publicFarm: (farmId: number) => Promise<void>;
  mapNavigationHandler: (
    id: number,
    latitude: number,
    longitude: number
  ) => void;
  postFarmNavigationHandler: () => void;
  settingNavigationHandler: () => void;
};

const FarmListTemplate = ({
  user,
  farms,
  isLoading,
  isRefetchingFarms,
  refetchFarms,
  deleteFarm,
  privateFarm,
  publicFarm,
  mapNavigationHandler,
  postFarmNavigationHandler,
  settingNavigationHandler,
}: FarmListTemplateProps) => {
  const { t } = useTranslation("farm");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const textColor = useColorModeValue("muted.600", "muted.300");

  return (
    <Box flex={1} safeAreaTop>
      <VStack space="3" px="8" pt="6" pb="12">
        <HStack alignItems="center" justifyContent="space-between">
          <Heading>{t("myFarm")}</Heading>
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
      {isLoading ? (
        <SkeletonFarmList rows={3} />
      ) : (
        <FlatList
          w="100%"
          mb="20"
          data={farms}
          renderItem={({ item }) => (
            <FarmItem
              item={item}
              onPress={() =>
                item.latitude &&
                item.longitude &&
                mapNavigationHandler(item.farmId, item.latitude, item.longitude)
              }
              onPressLeft={() =>
                item.privated
                  ? publicFarm(item.farmId)
                  : privateFarm(item.farmId)
              }
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
              refreshing={isRefetchingFarms}
              onRefresh={refetchFarms}
              tintColor={spinnerColor}
            />
          }
        />
      )}
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

export default FarmListTemplate;
