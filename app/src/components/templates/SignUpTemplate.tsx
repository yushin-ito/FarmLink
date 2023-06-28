import React, { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import {
  Button,
  Center,
  FormControl,
  HStack,
  Heading,
  Icon,
  IconButton,
  KeyboardAvoidingView,
  Link,
  Text,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

type FormValues = {
  email: string;
  password: string;
  displayName: string;
};

export type SignUpTemplateProps = {
  isLoading: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signInNavigationHandler: () => void;
};

const SignUpTemplate = memo(
  ({
    isLoading,
    signUpWithEmail,
    signInNavigationHandler,
  }: SignUpTemplateProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation("auth");
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValues>();

    return (
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Center flex={1} safeAreaTop>
            <VStack w="70%" space="5">
              <Heading
                fontSize="3xl"
                color="muted.600"
                mb="5"
                textAlign="center"
              >
                {t("signup")}
              </Heading>
              <FormControl isInvalid={"displayName" in errors}>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      autoFocus
                      returnKeyType="done"
                      placeholder={t("displayName")}
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
                  {errors.displayName && (
                    <Text>{errors.displayName.message}</Text>
                  )}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={"email" in errors}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      keyboardType="email-address"
                      returnKeyType="done"
                      placeholder={t("email")}
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
              <FormControl isInvalid={"password" in errors}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      returnKeyType="done"
                      placeholder={t("password")}
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
              <Button
                mt="5"
                colorScheme="brand"
                rounded="lg"
                onPress={handleSubmit((data) =>
                  signUpWithEmail(data.email, data.password, data.displayName)
                )}
                isLoading={isLoading}
              >
                {t("signup")}
              </Button>
            </VStack>
            <HStack mt="2" alignItems="center" space="2">
              <Text color="muted.400">{t("alreadyHaveAccount")}</Text>
              <Link
                _text={{ color: "brand.600" }}
                onPress={signInNavigationHandler}
              >
                {t("signin")}
              </Link>
            </HStack>
          </Center>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
);

export default SignUpTemplate;
