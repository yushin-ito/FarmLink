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
import RentalItem from "../organisms/RentalItem";
import { Alert } from "react-native";
import SkeletonRentalList from "../organisms/SkeletonRentalList";
import Fab from "../molecules/Fab";

type RentalListTemplateProps = {
  rentals: GetRentalsResponse | undefined;
  deleteRental: (rentalId: number) => Promise<void>;
  refetchRentals: () => Promise<void>;
  privateRental: (rentalId: number) => Promise<void>;
  publicRental: (rentalId: number) => Promise<void>;
  isLoadingRentals: boolean;
  isRefetchingRentals: boolean;
  mapNavigationHandler: (
    id: number,
    latitude: number,
    longitude: number
  ) => Promise<void>;
  postRentalNavigationHandler: () => void;
  goBackNavigationHandler: () => void;
};

const RentalListTemplate = ({
  rentals,
  deleteRental,
  isLoadingRentals,
  isRefetchingRentals,
  refetchRentals,
  privateRental,
  publicRental,
  mapNavigationHandler,
  postRentalNavigationHandler,
  goBackNavigationHandler,
}: RentalListTemplateProps) => {
  const { t } = useTranslation("setting");
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
        {isLoadingRentals ? (
          <SkeletonRentalList rows={4} />
        ) : (
          <FlatList
            data={rentals}
            renderItem={({ item }) => (
              <RentalItem
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
            refreshing={isRefetchingRentals}
            onRefresh={refetchRentals}
            keyExtractor={(item) => item.rentalId.toString()}
          />
        )}
      </Box>
      <Fab
        position="absolute"
        bottom="16"
        right="8"
        onPress={postRentalNavigationHandler}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </Fab>
    </Box>
  );
};

export default RentalListTemplate;
