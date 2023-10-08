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

export type SignUpTemplateProps = {
  isLoading: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  signUpWithTwitter: () => Promise<void>;
  signUpWithFacebook: () => Promise<void>;
  signInNavigationHandler: () => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  email: string;
  password: string;
  name: string;
};

const SignUpTemplate = memo(
  ({
    isLoading,
    signUpWithEmail,
    signUpWithGoogle,
    signUpWithTwitter,
    signUpWithFacebook,
    signInNavigationHandler,
    goBackNavigationHandler,
  }: SignUpTemplateProps) => {
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
        <HStack px="2" alignItems="center" justifyContent="space-between">
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
          <Heading fontSize="3xl">{t("signup")}</Heading>
          <Box size="12" />
        </HStack>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack flex={1} pt="6" pb="12" px="10" space="3">
            <FormControl isRequired isInvalid={"name" in errors}>
              <FormControl.Label>{t("displayName")}</FormControl.Label>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    returnKeyType="done"
                    placeholder={t("enter")}
                    placeholderTextColor="muted.400"
                    InputRightElement={
                      <Icon
                        as={<Feather />}
                        name="user"
                        size="4"
                        mr="2"
                        color="muted.400"
                      />
                    }
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                rules={{
                  required: t("displayNameRequired"),
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<Icon as={<Feather name="alert-circle" />} />}
              >
                {errors.name && <Text>{errors.name.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={"email" in errors}>
              <FormControl.Label>{t("email")}</FormControl.Label>
              <Controller
                name="email"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Input
                    keyboardType="email-address"
                    returnKeyType="done"
                    placeholder={t("enter")}
                    placeholderTextColor="muted.400"
                    InputRightElement={
                      <Icon
                        as={<Feather />}
                        name="mail"
                        size="4"
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
                  pattern: {
                    value: /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+$/,
                    message: t("invalidEmail"),
                  },
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
                            as={<Feather />}
                            name={showPassword ? "eye" : "eye-off"}
                            size="4"
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
                  minLength: {
                    value: 6,
                    message: t("passwordMinLength"),
                  },
                  pattern: {
                    value: /[a-zA-Z0-9.?/-]/,
                    message: t("invalidPassword"),
                  },
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
                mt="9"
                size="lg"
                rounded="xl"
                colorScheme="brand"
                onPress={handleSubmit((data) =>
                  signUpWithEmail(data.email, data.password, data.name)
                )}
                isLoading={isLoading}
              >
                <Text bold color="white" fontSize="md">
                  {t("signup")}
                </Text>
              </Button>
              <HStack mt="2" alignItems="center" space="2">
                <Text color={textColor}>{t("alreadyHaveAccount")}</Text>
                <Link
                  _text={{ color: "brand.600" }}
                  onPress={signInNavigationHandler}
                >
                  {t("signin")}
                </Link>
              </HStack>
            </VStack>
            <HStack
              mt="4"
              alignItems="center"
              justifyContent="center"
              space="3"
            >
              <Divider w="40%" bg="muted.300" />
              <Text color={textColor}>{t("or")}</Text>
              <Divider w="40%" bg="muted.300" />
            </HStack>
            <VStack mt="4" space="4">
              <Pressable
                py="3"
                rounded="full"
                borderWidth="1"
                borderColor="muted.200"
                alignItems="center"
                _pressed={{ bg: pressedColor }}
                onPress={signUpWithGoogle}
              >
                <Center h="100%" position="absolute" top="3" left="3">
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../../../assets/google.png")}
                  />
                </Center>
                <Text>{t("signUpWithGoogle")}</Text>
              </Pressable>
              <Pressable
                py="3"
                rounded="full"
                borderWidth="1"
                borderColor="muted.200"
                alignItems="center"
                _pressed={{ bg: pressedColor }}
                onPress={signUpWithTwitter}
              >
                <Center h="100%" position="absolute" top="3" left="3">
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../../../assets/twitter.png")}
                  />
                </Center>
                <Text>{t("signUpWithTwitter")}</Text>
              </Pressable>
              <Pressable
                py="3"
                rounded="full"
                borderWidth="1"
                borderColor="muted.200"
                alignItems="center"
                _pressed={{ bg: pressedColor }}
                onPress={signUpWithFacebook}
              >
                <Center h="100%" position="absolute" top="3" left="3">
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../../../assets/facebook.png")}
                  />
                </Center>
                <Text>{t("signUpWithFacebook")}</Text>
              </Pressable>
            </VStack>
          </VStack>
        </KeyboardAwareScrollView>
      </VStack>
    );
  }
);

export default SignUpTemplate;
