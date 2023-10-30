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

type RentalFilterProps = {
  goBackNavigationHandler: () => void;
};

const RentalFilterTemplate = memo(
  ({ goBackNavigationHandler }: RentalFilterProps) => {
    const { t } = useTranslation("map");

    const iconColor = useColorModeValue("muted.600", "muted.100");

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

export default RentalFilterTemplate;
