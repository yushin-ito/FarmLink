import React, { useEffect } from "react";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import {
  Button,
  KeyboardAvoidingView,
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  HStack,
  IconButton,
  Icon,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { GetUserResponse } from "../../hooks/user/query";

type PostProfileTemplateProps = {
  user: GetUserResponse | null | undefined;
  isLoading: boolean;
  postUser: (displayName: string, introduction: string) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  displayName: string;
  introduction: string;
};

const PostProfileTemplate = ({
  user,
  isLoading,
  postUser,
  goBackNavigationHandler,
}: PostProfileTemplateProps) => {
  const { t } = useTranslation("setting");
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (user?.displayName) {
      setValue("displayName", user.displayName);
    }
    if (user?.introduction) {
      setValue("introduction", user.introduction);
    }
  }, [user]);

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={height / 15}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1} pt="6" pb="12" px="2" justifyContent="space-between">
          <VStack space="7">
            <HStack alignItems="center" justifyContent="space-between">
              <IconButton
                onPress={goBackNavigationHandler}
                icon={<Icon as={<Feather name="chevron-left" />} size="6" />}
                variant="unstyled"
                _pressed={{
                  opacity: 0.5,
                }}
              />
              <Heading textAlign="center">{t("profile")}</Heading>
              <IconButton
                onPress={goBackNavigationHandler}
                icon={<Icon as={<Feather name="x" />} size="6" />}
                variant="unstyled"
                _pressed={{
                  opacity: 0.5,
                }}
              />
            </HStack>
            <VStack mx="10">
              <FormControl isInvalid={"displayName" in errors}>
                <FormControl.Label>{t("displayName")}</FormControl.Label>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <VStack>
                        <Input
                          autoFocus
                          returnKeyType="done"
                          InputRightElement={
                            <IconButton
                              onPress={() => setValue("displayName", "")}
                              icon={
                                <Icon
                                  as={<Feather name="x" />}
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
                        <HStack mt="1" justifyContent="space-between">
                          <FormControl.ErrorMessage
                            leftIcon={
                              <Icon as={<Feather name="alert-circle" />} />
                            }
                          >
                            {errors.displayName && (
                              <Text>{errors.displayName.message}</Text>
                            )}
                          </FormControl.ErrorMessage>
                          <Text color="muted.600">{value?.length}/20</Text>
                        </HStack>
                      </VStack>
                    );
                  }}
                  rules={{
                    required: t("displayNameRequired"),
                    maxLength: {
                      value: 20,
                      message: t("displayNameMaxLength"),
                    },
                  }}
                />
              </FormControl>
              <FormControl isInvalid={"profile" in errors}>
                <FormControl.Label>{t("profile")}</FormControl.Label>
                <Controller
                  name="introduction"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <VStack>
                        <Input
                          returnKeyType="done"
                          InputRightElement={
                            <IconButton
                              onPress={() => setValue("introduction", "")}
                              icon={
                                <Icon
                                  as={<Feather name="x" />}
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
                        <HStack mt="1" justifyContent="space-between">
                          <FormControl.ErrorMessage
                            leftIcon={
                              <Icon as={<Feather name="alert-circle" />} />
                            }
                          >
                            {errors.introduction && (
                              <Text>{errors.introduction.message}</Text>
                            )}
                          </FormControl.ErrorMessage>
                          <Text color="muted.600">{value?.length}/30</Text>
                        </HStack>
                      </VStack>
                    );
                  }}
                  rules={{
                    required: t("profileRequired"),
                    maxLength: {
                      value: 30,
                      message: t("profileMaxLength"),
                    },
                  }}
                />
              </FormControl>
            </VStack>
          </VStack>
          <Button
            mx="10"
            size="lg"
            rounded="lg"
            colorScheme="brand"
            isLoading={isLoading}
            onPress={handleSubmit(async (data) => {
              await postUser(data.displayName, data.introduction);
            })}
          >
            {t("save")}
          </Button>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PostProfileTemplate;
