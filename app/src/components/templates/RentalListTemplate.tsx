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
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import { GetRentalsResponse } from "../../hooks/rental/query";
import RentalListItem from "../organisms/RentalListItem";
import { Alert, RefreshControl } from "react-native";
import SkeletonRentalList from "../organisms/SkeletonRentalList";
import Fab from "../molecules/Fab";

type RentalListTemplateProps = {
  rentals: GetRentalsResponse | undefined;
  deleteRental: (rentalId: number) => Promise<void>;
  refetchRentals: () => Promise<void>;
  privateRental: (rentalId: number) => Promise<void>;
  publicRental: (rentalId: number) => Promise<void>;
  isLoading: boolean;
  isRefetchingRentals: boolean;
  mapNavigationHandler: (
    regionId: number,
    latitude: number,
    longitude: number
  ) => Promise<void>;
  postRentalNavigationHandler: () => void;
  goBackNavigationHandler: () => void;
};

const RentalListTemplate = ({
  rentals,
  deleteRental,
  isLoading,
  isRefetchingRentals,
  refetchRentals,
  privateRental,
  publicRental,
  mapNavigationHandler,
  postRentalNavigationHandler,
  goBackNavigationHandler,
}: RentalListTemplateProps) => {
  const { t } = useTranslation("setting");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
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
        <Heading textAlign="center">{t("rentalList")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <Box flex={1}>
        {isLoading ? (
          <SkeletonRentalList rows={4} />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 40 }}
            data={rentals}
            renderItem={({ item }) => (
              <RentalListItem
                item={item}
                onPress={() =>
                  item.latitude &&
                  item.longitude &&
                  mapNavigationHandler(
                    item.rentalId,
                    item.latitude,
                    item.longitude
                  )
                }
                onPressLeft={() =>
                  item.privated
                    ? publicRental(item.rentalId)
                    : privateRental(item.rentalId)
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
                color={textColor}
              >
                {t("notExistRental")}
              </Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingRentals}
                onRefresh={refetchRentals}
                tintColor={spinnerColor}
              />
            }
            keyExtractor={(item) => item.rentalId.toString()}
          />
        )}
      </Box>
      <Fab
        position="absolute"
        bottom="12"
        right="8"
        onPress={postRentalNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </Fab>
    </Box>
  );
};

export default RentalListTemplate;
