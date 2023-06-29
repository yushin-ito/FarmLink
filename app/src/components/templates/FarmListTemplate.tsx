import {
  Box,
  VStack,
  HStack,
  Heading,
  Center,
  Spinner,
  Icon,
  FlatList,
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
  farmCameraNavigationHandler: (
    farmId: number,
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
  farmCameraNavigationHandler,
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
      <VStack space="3" px="9" pt="6" pb="12">
        <HStack alignItems="center" justifyContent="space-between">
          <Heading>{t("myFarm")}</Heading>
          <Avatar user={user} onPress={settingNavigationHandler} />
        </HStack>
      </VStack>
      <FlatList
        w="100%"
        px="9"
        mb="20"
        data={farms}
        renderItem={({ item }) => (
          <FarmItem
            item={item}
            deleteFarm={deleteFarm}
            farmCameraNavigationHandler={farmCameraNavigationHandler}
          />
        )}
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
