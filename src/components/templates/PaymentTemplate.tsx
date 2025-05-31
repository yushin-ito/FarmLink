import React from "react";

import { Feather } from "@expo/vector-icons";
import {
  Box,
  HStack,
  Heading,
  Text,
  Icon,
  IconButton,
  Pressable,
  VStack,
  useColorModeValue,
  Divider,
} from "native-base";
import { useTranslation } from "react-i18next";

import { GetUserResponse } from "../../hooks/user/query";
import Overlay from "../molecules/Overlay";

type PaymentTemplateProps = {
  user: GetUserResponse | undefined;
  signUpToStripe: () => Promise<void>;
  signInToStripe: () => Promise<void>;
  subscribeToApp: () => Promise<void>;
  isLoading: boolean;
  goBackNavigationHandler: () => void;
};

const PaymentTemplate = ({
  signUpToStripe,
  signInToStripe,
  subscribeToApp,
  isLoading,
  goBackNavigationHandler,
}: PaymentTemplateProps) => {
  const { t } = useTranslation("setting");

  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Box flex={1} safeAreaTop>
      <Overlay isOpen={isLoading} />
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
        <Heading>{t("payment")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <Box flex={1} px="8">
        <VStack>
          <Pressable
            py="5"
            _pressed={{
              opacity: 0.5,
            }}
            onPress={signUpToStripe}
          >
            <HStack pl="1" alignItems="center" justifyContent="space-between">
              <Text fontSize="md">{t("createAccount")}</Text>
              <Icon
                as={<Feather />}
                name="chevron-right"
                size="md"
                color={iconColor}
              />
            </HStack>
          </Pressable>
          <Divider />
          <Pressable
            py="5"
            _pressed={{
              opacity: 0.5,
            }}
            onPress={signInToStripe}
          >
            <HStack pl="1" alignItems="center" justifyContent="space-between">
              <Text fontSize="md">{t("dashboard")}</Text>
              <Icon
                as={<Feather />}
                name="chevron-right"
                size="md"
                color={iconColor}
              />
            </HStack>
          </Pressable>
          <Divider />
          <Pressable
            py="5"
            _pressed={{
              opacity: 0.5,
            }}
            onPress={subscribeToApp}
          >
            <HStack pl="1" alignItems="center" justifyContent="space-between">
              <Text fontSize="md">{t("subscribe")}</Text>
              <Icon
                as={<Feather />}
                name="chevron-right"
                size="md"
                color={iconColor}
              />
            </HStack>
          </Pressable>
          <Divider />
        </VStack>
      </Box>
    </Box>
  );
};

export default PaymentTemplate;
