import React, { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  HStack,
  Heading,
  Icon,
  IconButton,
  Link,
  Pressable,
  Text,
  VStack,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

type SignInTemplateProps = {
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signUpNavigationHandler: () => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  email: string;
  password: string;
};

const SignInTemplate = memo(
  ({
    isLoading,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    signInWithTwitter,
    signInWithFacebook,
    signUpNavigationHandler,
    goBackNavigationHandler,
  }: SignInTemplateProps) => {
    const { t } = useTranslation("auth");
    const textColor = useColorModeValue("muted.500", "muted.300");
    const iconColor = useColorModeValue("black", "white");
    const pressedColor = useColorModeValue("muted.100", "muted.800");

    const [showPassword, setShowPassword] = useState(false);
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValues>();

    return (
      <VStack flex={1} safeAreaTop>
        <StatusBar style={useColorModeValue("dark", "light")} />
        <HStack
          pt="2"
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
            alignSelf="flex-start"
            variant="unstyled"
          />
          <Heading fontSize="3xl">{t("signin")}</Heading>
          <Box size="12" />
        </HStack>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack flex={1} pt="9" pb="12" px="12" space="3">
            <FormControl isRequired isInvalid={"email" in errors}>
              <FormControl.Label>{t("email")}</FormControl.Label>
              <Controller
                name="email"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    returnKeyType="done"
                    keyboardType="email-address"
                    placeholder={t("enter")}
                    placeholderTextColor="muted.400"
                    InputRightElement={
                      <Icon
                        as={<Feather name="mail" />}
                        size="5"
                        mr="2"
                        color="muted.400"
                      />
                    }
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                rules={{
                  required: t("emailRequired"),
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<Icon as={<Feather name="alert-circle" />} />}
              >
                {errors.email && <Text>{errors.email.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={"password" in errors}>
              <FormControl.Label>{t("password")}</FormControl.Label>
              <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    returnKeyType="done"
                    placeholder={t("enter")}
                    placeholderTextColor="muted.400"
                    type={showPassword ? "text" : "password"}
                    InputRightElement={
                      <IconButton
                        onPress={() => setShowPassword(!showPassword)}
                        icon={
                          <Icon
                            as={
                              <Feather
                                name={showPassword ? "eye" : "eye-off"}
                              />
                            }
                            size="5"
                            color="muted.400"
                          />
                        }
                        variant="unstyled"
                        _pressed={{
                          opacity: 0.5,
                        }}
                      />
                    }
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                rules={{
                  required: t("passwordRequired"),
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<Icon as={<Feather name="alert-circle" />} />}
              >
                {errors.password && <Text>{errors.password.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
            <VStack alignItems="center">
              <Button
                w="100%"
                mt="12"
                size="lg"
                rounded="xl"
                colorScheme="brand"
                onPress={handleSubmit((data) =>
                  signInWithEmail(data.email, data.password)
                )}
                isLoading={isLoading}
              >
                <Text bold color="white" fontSize="md">
                  {t("signin")}
                </Text>
              </Button>
              <HStack mt="3" alignItems="center" space="2">
                <Text color={textColor}>{t("notHaveAccount")}</Text>
                <Link
                  _text={{ color: "brand.600" }}
                  onPress={signUpNavigationHandler}
                >
                  {t("signup")}
                </Link>
              </HStack>
            </VStack>
            <HStack
              my="5"
              alignItems="center"
              justifyContent="center"
              space="3"
            >
              <Divider w="40%" bg="muted.300" />
              <Text color={textColor}>{t("or")}</Text>
              <Divider w="40%" bg="muted.300" />
            </HStack>
            <VStack space="4">
              <Pressable
                py="3"
                rounded="full"
                borderWidth="1"
                borderColor="muted.200"
                alignItems="center"
                _pressed={{ bg: pressedColor }}
                onPress={signInWithGoogle}
              >
                <Center h="100%" position="absolute" top="3" left="3">
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../../../assets/provider/google.png")}
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
                _pressed={{ bg: pressedColor }}
                onPress={signInWithApple}
              >
                <Center h="100%" position="absolute" top="3" left="3">
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../../../assets/provider/apple.png")}
                  />
                </Center>
                <Text>{t("signInWithApple")}</Text>
              </Pressable>
              <Pressable
                py="3"
                rounded="full"
                borderWidth="1"
                borderColor="muted.200"
                alignItems="center"
                _pressed={{ bg: pressedColor }}
                onPress={signInWithTwitter}
              >
                <Center h="100%" position="absolute" top="3" left="3">
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../../../assets/provider/twitter.png")}
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
                _pressed={{ bg: pressedColor }}
                onPress={signInWithFacebook}
              >
                <Center h="100%" position="absolute" top="3" left="3">
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../../../assets/provider/facebook.png")}
                  />
                </Center>
                <Text>{t("signInWithFacebook")}</Text>
              </Pressable>
            </VStack>
          </VStack>
        </KeyboardAwareScrollView>
      </VStack>
    );
  }
);

export default SignInTemplate;
