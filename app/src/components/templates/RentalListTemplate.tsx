import React from "react";
import { Feather } from "@expo/vector-icons";

import {
  Box,
  Heading,
  HStack,
  IconButton,
  Icon,
  FlatList,
  Text,
} from "native-base";
import { useTranslation } from "react-i18next";
import { GetRentalsResponse } from "../../hooks/rental/query";
import RentalItem from "../organisms/RentalItem";
import { Alert, RefreshControl } from "react-native";
import SkeletonRentalList from "../organisms/SkeltonRentalList";

type RentalListTemplateProps = {
  rentals: GetRentalsResponse | undefined;
  deleteRental: (rentalId: number) => Promise<void>;
  refetchRentals: () => Promise<void>;
  mapNavigationHandler: (
    latitude: number | null,
    longitude: number | null
  ) => Promise<void>;
  isLoadingRentals: boolean;
  isRefetchingRentals: boolean;
  goBackNavigationHandler: () => void;
};

const RentalListTemplate = ({
  rentals,
  deleteRental,
  isLoadingRentals,
  isRefetchingRentals,
  refetchRentals,
  mapNavigationHandler,
  goBackNavigationHandler,
}: RentalListTemplateProps) => {
  const { t } = useTranslation("setting");

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
          variant="unstyled"
        />
        <Heading textAlign="center">{t("rentalList")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" />}
          variant="unstyled"
        />
      </HStack>
      <Box flex={1}>
        {isLoadingRentals ? (
          <SkeletonRentalList rows={4} />
        ) : (
          <FlatList
            data={rentals}
            renderItem={({ item }) => (
              <RentalItem
                item={item}
                onPress={() =>
                  mapNavigationHandler(item.latitude, item.longitude)
                }
                onPressRight={() =>
                  Alert.alert(t("deleteRental"), t("askDeleteRental"), [
                    {
                      text: t("cancel"),
                      style: "cancel",
                    },
                    {
                      text: t("delete"),
                      onPress: async () => await deleteRental(item.rentalId),
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
                color="muted.600"
              >
                {t("notExistRental")}
              </Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingRentals}
                onRefresh={refetchRentals}
              />
            }
            keyExtractor={(item) => item.rentalId.toString()}
          />
        )}
      </Box>
    </Box>
  );
};

export default RentalListTemplate;
