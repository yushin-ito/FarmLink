import React from "react";
import { Alert, RefreshControl } from "react-native";

import { Feather } from "@expo/vector-icons";
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
import { useTranslation } from "react-i18next";

import { GetUserFarmsResponse } from "../../hooks/farm/query";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import Fab from "../molecules/Fab";
import FarmListItem from "../organisms/FarmListItem";
import SkeletonFarmList from "../organisms/SkeletonFarmList";

type FarmListTemplateProps = {
  user: GetUserResponse | undefined;
  farms: GetUserFarmsResponse | undefined;
  refetchFarms: () => Promise<void>;
  privateFarm: (farmId: number) => Promise<void>;
  publicFarm: (farmId: number) => Promise<void>;
  deleteFarm: (farmId: number) => Promise<void>;
  farmDetailNavigationHandler: (farmId: number) => void;
  isLoading: boolean;
  isRefetchingFarms: boolean;
  postFarmNavigationHandler: () => void;
  settingNavigationHandler: () => void;
};

const FarmListTemplate = ({
  user,
  farms,
  refetchFarms,
  privateFarm,
  publicFarm,
  deleteFarm,
  isLoading,
  isRefetchingFarms,
  farmDetailNavigationHandler,
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
          mb="20"
          data={farms}
          renderItem={({ item }) => (
            <FarmListItem
              item={item}
              onPress={() => farmDetailNavigationHandler(item.farmId)}
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
