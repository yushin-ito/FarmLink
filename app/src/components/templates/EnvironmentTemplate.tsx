import React from "react";
import { ColorSchemeName } from "react-native";

import { Feather } from "@expo/vector-icons";
import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  IconButton,
  Icon,
  useColorModeValue,
  Radio,
} from "native-base";
import { useTranslation } from "react-i18next";

import { Locale } from "../../types";
import Overlay from "../molecules/Overlay";

type EnvironmentTemplateProps = {
  locale: Locale | null;
  theme: ColorSchemeName;
  changeLanguage: (language: Locale | null) => Promise<void>;
  changeTheme: (theme: ColorSchemeName) => Promise<void>;
  isLoading: boolean;
  isLoadingChangeLanguage: boolean;
  isLoadingChangeTheme: boolean;
  goBackNavigationHandler: () => void;
};

const EnvironmentTemplate = ({
  locale,
  theme,
  changeLanguage,
  changeTheme,
  isLoading,
  isLoadingChangeLanguage,
  isLoadingChangeTheme,
  goBackNavigationHandler,
}: EnvironmentTemplateProps) => {
  const { t } = useTranslation("setting");

  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Box flex={1} safeAreaTop>
      <Overlay isOpen={isLoadingChangeLanguage || isLoadingChangeTheme} />
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
        <Heading textAlign="center">{t("environment")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      {!isLoading && (
        <VStack px="10">
          <VStack mt="2" space="3">
            <Text bold fontSize="lg">
              {t("language")}
            </Text>
            {
              <Radio.Group
                name="language"
                accessibilityLabel="switch language"
                value={[null, "ja", "en"]
                  .indexOf(locale as string | null)
                  .toString()}
                onChange={(value) => {
                  const languages = [null, "ja", "en"] as Locale[];
                  changeLanguage(languages[Number(value)]);
                }}
              >
                <VStack space="3">
                  <Radio value="0" mr="2" colorScheme="brand">
                    {t("system")}
                  </Radio>
                  <Radio value="1" mr="2" colorScheme="brand">
                    {t("japanese")}
                  </Radio>
                  <Radio value="2" mr="2" colorScheme="brand">
                    {t("english")}
                  </Radio>
                </VStack>
              </Radio.Group>
            }
          </VStack>
          <VStack mt="9" space="3">
            <Text bold fontSize="lg">
              {t("theme")}
            </Text>
            <Radio.Group
              name="theme"
              accessibilityLabel="switch theme"
              value={[null, "light", "dark"]
                .indexOf(theme as string | null)
                .toString()}
              onChange={(value) => {
                const themes = [null, "light", "dark"] as ColorSchemeName[];
                changeTheme(themes[Number(value)]);
              }}
            >
              <VStack space="3">
                <Radio value="0" mr="2" colorScheme="brand">
                  {t("system")}
                </Radio>
                <Radio value="1" mr="2" colorScheme="brand">
                  {t("light")}
                </Radio>
                <Radio value="2" mr="2" colorScheme="brand">
                  {t("dark")}
                </Radio>
              </VStack>
            </Radio.Group>
          </VStack>
        </VStack>
      )}
    </Box>
  );
};

export default EnvironmentTemplate;
