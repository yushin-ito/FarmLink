import React, { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import {
  Button,
  FormControl,
  HStack,
  Heading,
  Icon,
  IconButton,
  Link,
  Text,
  VStack,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export type SignUpTemplateProps = {
  isLoading: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
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
    signInNavigationHandler,
    goBackNavigationHandler,
  }: SignUpTemplateProps) => {
    const { t } = useTranslation("auth");
    const textColor = useColorModeValue("muted.500", "muted.300");
    const iconColor = useColorModeValue("muted.400", "muted.200");

    const [showPassword, setShowPassword] = useState(false);
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValues>();

    return (
      <VStack flex={1} safeAreaTop>
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
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack flex={1} pt="20" px="10" space="5">
            <Heading fontSize="3xl" mb="5" textAlign="center">
              {t("signup")}
            </Heading>
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
                mt="12"
                size="lg"
                rounded="xl"
                colorScheme="brand"
                onPress={handleSubmit((data) =>
                  signUpWithEmail(data.email, data.password, data.name)
                )}
                isLoading={isLoading}
              >
                <Text bold color="white" fontSize="md">
                  {t("signin")}
                </Text>
              </Button>
              <HStack mt="2" alignItems="center" space="2">
                <Text color={textColor}>{t("notHaveAccount")}</Text>
                <Link
                  _text={{ color: "brand.600" }}
                  onPress={signInNavigationHandler}
                >
                  {t("signup")}
                </Link>
              </HStack>
            </VStack>
          </VStack>
        </KeyboardAwareScrollView>
      </VStack>
    );
  }
);

export default SignUpTemplate;
