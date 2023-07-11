import React from "react";
import { Feather } from "@expo/vector-icons";

import { Box, Heading, HStack, IconButton, Icon, FlatList } from "native-base";
import { useTranslation } from "react-i18next";
import { GetRentalsResponse } from "../../hooks/rental/query";
import RentalItem from "../organisms/RentalItem";

type RentalListTemplateProps = {
  rentals: GetRentalsResponse | undefined;
  deleteRental: (rentalId: number) => Promise<void>;
  mapNavigationHandler: (
    latitude: number | null,
    longitude: number | null
  ) => Promise<void>;
  goBackNavigationHandler: () => void;
};

const RentalListTemplate = ({
  rentals,
  deleteRental,
  mapNavigationHandler,
  goBackNavigationHandler,
}: RentalListTemplateProps) => {
  const { t } = useTranslation("setting");

  return (
    <Box flex={1} safeAreaTop>
      <HStack w="100%" alignItems="center" justifyContent="space-between">
        <IconButton
          p="6"
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
          variant="unstyled"
        />
        <Heading textAlign="center">{t("rentalList")}</Heading>
        <IconButton
          p="6"
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" />}
          variant="unstyled"
        />
      </HStack>
      <Box flex={1}>
        <FlatList
          data={rentals}
          renderItem={({ item }) => (
            <RentalItem
              item={item}
              deleteRental={deleteRental}
              onPress={() =>
                mapNavigationHandler(item.latitude, item.longitude)
              }
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default RentalListTemplate;
