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
import BackButton from "../molecules/BackButton";

type FormValues = {
  email: string;
  password: string;
};

type SignInTemplateProps = {
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpNavigationHandler: () => void;
  goBackNavigationHandler: () => void;
};

const SignInTemplate = memo(
  ({
    isLoading,
    signInWithEmail,
    signUpNavigationHandler,
    goBackNavigationHandler,
  }: SignInTemplateProps) => {
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
            <BackButton
              position="absolute"
              top="12"
              left="3"
              onPress={goBackNavigationHandler}
              text={t("back")}
            />
            <VStack w="70%" space="5">
              <Heading
                fontSize="3xl"
                color="muted.600"
                mb="5"
                textAlign="center"
              >
                {t("signin")}
              </Heading>
              <FormControl isRequired isInvalid={"email" in errors}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      autoFocus
                      returnKeyType="done"
                      keyboardType="email-address"
                      placeholder={t("email")}
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
                              as={
                                <Feather
                                  name={showPassword ? "eye" : "eye-off"}
                                />
                              }
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
              <Button
                mt="5"
                colorScheme="brand"
                rounded="lg"
                onPress={handleSubmit((data) =>
                  signInWithEmail(data.email, data.password)
                )}
                isLoading={isLoading}
              >
                {t("signin")}
              </Button>
            </VStack>
            <HStack mt="2" alignItems="center" space="2">
              <Text color="muted.400">{t("notHaveAccount")}</Text>
              <Link
                _text={{ color: "brand.600" }}
                onPress={signUpNavigationHandler}
              >
                {t("signup")}
              </Link>
            </HStack>
          </Center>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
);

export default SignInTemplate;
