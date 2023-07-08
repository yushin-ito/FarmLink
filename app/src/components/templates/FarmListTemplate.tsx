import {
  Box,
  VStack,
  HStack,
  Heading,
  Center,
  Spinner,
  Icon,
  FlatList,
  Text,
} from "native-base";
import React from "react";
import { RefreshControl } from "react-native";
import CircleButton from "../molecules/CircleButton";
import FarmItem from "../organisms/FarmItem";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type FarmListTemplateProps = {
  user: GetUserResponse | null | undefined;
  farms: GetFarmsResponse | null | undefined;
  isLoadingFarms: boolean;
  isRefetchingFarms: boolean;
  refetchFarms: () => Promise<void>;
  deleteFarm: (farmId: number) => Promise<void>;
  farmDeviceNavigationHandler: (
    deviceId: string | null,
    farmName: string | null
  ) => void;
  postFarmNavigationHandler: () => void;
  settingNavigationHandler: () => void;
};

const FarmListTemplate = ({
  user,
  farms,
  isLoadingFarms,
  isRefetchingFarms,
  refetchFarms,
  deleteFarm,
  farmDeviceNavigationHandler,
  postFarmNavigationHandler,
  settingNavigationHandler,
}: FarmListTemplateProps) => {
  const { t } = useTranslation("farm");
  if (isLoadingFarms) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <Box flex={1} safeAreaTop>
      <VStack space="3" px="8" pt="6" pb="12">
        <HStack alignItems="center" justifyContent="space-between">
          <Heading>{t("myFarm")}</Heading>
          <Avatar
            text={user?.displayName?.charAt(0)}
            avatarUrl={user?.avatarUrl}
            updatedAt={user?.updatedAt}
            hue={user?.hue}
            onPress={settingNavigationHandler}
          />
        </HStack>
      </VStack>
      <FlatList
        w="100%"
        px="8"
        mb="20"
        data={farms}
        renderItem={({ item }) => (
          <FarmItem
            item={item}
            deleteFarm={deleteFarm}
            onPress={() =>
              farmDeviceNavigationHandler(item.deviceId, item.farmName)
            }
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
        keyExtractor={(item) => item.farmId.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingFarms}
            onRefresh={refetchFarms}
          />
        }
      />

      <CircleButton
        position="absolute"
        bottom="24"
        right="8"
        onPress={postFarmNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </CircleButton>
    </Box>
  );
};

export default FarmListTemplate;
