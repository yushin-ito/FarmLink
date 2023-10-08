import React, { memo } from "react";
import { Box, Button, Heading, Text, VStack } from "native-base";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";

export type WelcomeTemplateProps = {
  signInNavigationHandler: () => void;
  signUpNavigationHandler: () => void;
};

const WelcomeTemplate = memo(
  ({
    signInNavigationHandler,
    signUpNavigationHandler,
  }: WelcomeTemplateProps) => {
    const { t } = useTranslation("auth");

    return (
      <Box
        flex={1}
        pt="64"
        px="12"
        pb="24"
        justifyContent="space-between"
        bg="brand.600"
      >
        <StatusBar style="light" />
        <VStack w="100%" space="4">
          <Heading color="white" fontSize="32">
            {t("welcome")}
          </Heading>
          <Text bold color="white" fontSize="md" textAlign="center">
            {t("app")}
          </Text>
        </VStack>
        <VStack w="100%" space="4">
          <Button
            size="lg"
            rounded="lg"
            bg="white"
            _pressed={{ bg: "muted.200" }}
            onPress={signUpNavigationHandler}
          >
            <Text bold color="brand.600" fontSize="lg">
              {t("signup")}
            </Text>
          </Button>
          <Button
            variant="unstyled"
            size="lg"
            rounded="lg"
            _pressed={{ opacity: 0.5 }}
            onPress={signInNavigationHandler}
          >
            <Text bold color="white" fontSize="lg">
              {t("signin")}
            </Text>
          </Button>
        </VStack>
      </Box>
    );
  }
);

export default WelcomeTemplate;
