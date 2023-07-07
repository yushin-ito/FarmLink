import React, { memo } from "react";
import {
  Center,
  Heading,
  Text,
  VStack,
  Image,
  Pressable,
  Icon,
  Box,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";

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
            borderColor="muted.300"
            alignItems="center"
            _pressed={{ bg: "muted.300" }}
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
            borderColor="muted.300"
            alignItems="center"
            _pressed={{ bg: "muted.300" }}
            onPress={signInWithGoogle}
          >
            <Center h="100%" position="absolute" top="3" left="3">
              <Image
                size="8"
                source={require("../../../assets/google.png")}
                alt=""
              />
            </Center>
            <Text>{t("signInWithGoogle")}</Text>
          </Pressable>
          <Pressable
            py="3"
            rounded="full"
            borderWidth="1"
            borderColor="muted.300"
            alignItems="center"
            _pressed={{ bg: "muted.300" }}
            onPress={signInWithTwitter}
          >
            <Center h="100%" position="absolute" top="3" left="3">
              <Image
                size="8"
                source={require("../../../assets/twitter.png")}
                alt=""
              />
            </Center>
            <Text>{t("signInWithTwitter")}</Text>
          </Pressable>
          <Pressable
            py="3"
            rounded="full"
            borderWidth="1"
            borderColor="muted.300"
            alignItems="center"
            _pressed={{ bg: "muted.300" }}
            onPress={signInWithFacebook}
          >
            <Center h="100%" position="absolute" top="3" left="3">
              <Image
                size="8"
                source={require("../../../assets/facebook.png")}
                alt=""
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
