import {
  Box,
  VStack,
  HStack,
  Heading,
  Icon,
  FlatList,
  Text,
} from "native-base";
import React from "react";
import Fab from "../molecules/Fab";
import FarmItem from "../organisms/FarmItem";
import { GetUserFarmsResponse } from "../../hooks/farm/query";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import SkeltonFarmList from "../organisms/SkeltonFarmList";

type FarmListTemplateProps = {
  user: GetUserResponse | null | undefined;
  farms: GetUserFarmsResponse | null | undefined;
  isLoading: boolean;
  isRefetchingFarms: boolean;
  refetchFarms: () => Promise<void>;
  deleteFarm: (farmId: number) => Promise<void>;
  farmDetailNavigationHandler: (farmId: number, deviceId: string) => void;
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
  farmDetailNavigationHandler,
  postFarmNavigationHandler,
  settingNavigationHandler,
}: FarmListTemplateProps) => {
  const { t } = useTranslation("farm");

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
        <SkeltonFarmList rows={6} />
      ) : (
        <FlatList
          w="100%"
          mb="20"
          data={farms}
          renderItem={({ item }) => (
            <FarmItem
              item={item}
              onPress={() =>
                farmDetailNavigationHandler(item.farmId, item.deviceId)
              }
              onPressRight={() => deleteFarm(item.farmId)}
            />
          )}
          ListEmptyComponent={
            <Text
              bold
              lineHeight="2xl"
              fontSize="md"
              textAlign="center"
              color="muted.600"
            >
              {t("notExistFarm")}
            </Text>
          }
          refreshing={isRefetchingFarms}
          onRefresh={refetchFarms}
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
