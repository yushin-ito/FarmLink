import React, { memo } from "react";
import {
  Center,
  Heading,
  Text,
  VStack,
  Pressable,
  Icon,
  Box,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

export type ProviderTemplateProps = {
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInNavigationHandler: () => void;
};

const ProviderTemplate = memo(
  ({
    signInWithGoogle,
    signInWithTwitter,
    signInWithFacebook,
    signInNavigationHandler,
  }: ProviderTemplateProps) => {
    const { t } = useTranslation("auth");

    return (
      <Box
        flex={1}
        alignItems="center"
        justifyContent="space-between"
        py="32"
        safeAreaTop
      >
        <VStack alignItems="center" space="1">
          <Heading fontSize="3xl" color="brand.600">
            Welcome to FarmLink!
          </Heading>
          <Text color="muted.600" bold>
            {t("app")}
          </Text>
        </VStack>
        <VStack w="70%" mt="6" space="4">
          <Pressable
            py="3"
            rounded="full"
            borderWidth="1"
            borderColor="muted.200"
            alignItems="center"
            _pressed={{ bg: "muted.100" }}
            onPress={signInNavigationHandler}
          >
            <Center h="100%" position="absolute" top="3" left="5">
              <Icon as={<Feather />} name="mail" size="5" />
            </Center>
            <Text>{t("signInWithEmail")}</Text>
          </Pressable>
          <Pressable
            py="3"
            rounded="full"
            borderWidth="1"
            borderColor="muted.200"
            alignItems="center"
            _pressed={{ bg: "muted.100" }}
            onPress={signInWithGoogle}
          >
            <Center h="100%" position="absolute" top="3" left="3">
              <Image
                style={{ width: 32, height: 32 }}
                source={require("../../../assets/google.png")}
                cachePolicy="memory-disk"
              />
            </Center>
            <Text>{t("signInWithGoogle")}</Text>
          </Pressable>
          <Pressable
            py="3"
            rounded="full"
            borderWidth="1"
            borderColor="muted.200"
            alignItems="center"
            _pressed={{ bg: "muted.100" }}
            onPress={signInWithTwitter}
          >
            <Center h="100%" position="absolute" top="3" left="3">
              <Image
                style={{ width: 32, height: 32 }}
                source={require("../../../assets/twitter.png")}
                cachePolicy="memory-disk"
              />
            </Center>
            <Text>{t("signInWithTwitter")}</Text>
          </Pressable>
          <Pressable
            py="3"
            rounded="full"
            borderWidth="1"
            borderColor="muted.200"
            alignItems="center"
            _pressed={{ bg: "muted.100" }}
            onPress={signInWithFacebook}
          >
            <Center h="100%" position="absolute" top="3" left="3">
              <Image
                style={{ width: 32, height: 32 }}
                source={require("../../../assets/facebook.png")}
                cachePolicy="memory-disk"
              />
            </Center>
            <Text>{t("signInWithFacebook")}</Text>
          </Pressable>
        </VStack>
      </Box>
    );
  }
);

export default ProviderTemplate;
