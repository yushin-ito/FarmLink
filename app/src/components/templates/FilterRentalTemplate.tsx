import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import {
  Box,
  HStack,
  Heading,
  Icon,
  IconButton,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";

type FilterRentalProps = {
  goBackNavigationHandler: () => void;
};

const FilterRentalTemplate = memo(
  ({ goBackNavigationHandler }: FilterRentalProps) => {
    const { t } = useTranslation("map");

    const iconColor = useColorModeValue("muted.500", "muted.300");

    return (
      <Box flex={1} safeAreaTop>
        <HStack
          mb="2"
          px="2"
          alignItems="center"
          justifyContent="space-between"
        >
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
          <Heading>{t("filter")}</Heading>
          <IconButton
            onPress={goBackNavigationHandler}
            icon={
              <Icon as={<Feather name="x" />} size="xl" color={iconColor} />
            }
            variant="unstyled"
          />
        </HStack>
      </Box>
    );
  }
);

export default FilterRentalTemplate;
