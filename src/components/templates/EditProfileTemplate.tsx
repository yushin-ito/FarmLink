import React, { useEffect } from "react";

import { Feather } from "@expo/vector-icons";
import {
  Button,
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  HStack,
  IconButton,
  Icon,
  useColorModeValue,
  ScrollView,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { GetUserResponse } from "../../hooks/user/query";
import Input from "../molecules/Input";

type EditProfileTemplateProps = {
  user: GetUserResponse | undefined;
  isLoadingUpdateProfile: boolean;
  updateProfile: (name: string, profile: string) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  name: string;
  profile: string;
};

const EditProfileTemplate = ({
  user,
  isLoadingUpdateProfile,
  updateProfile,
  goBackNavigationHandler,
}: EditProfileTemplateProps) => {
  const { t } = useTranslation("setting");

  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    user?.name && setValue("name", user.name);
    user?.profile && setValue("profile", user.profile);
  }, [user]);

  return (
    <Box flex={1} pb="16" justifyContent="space-between" safeAreaTop>
      <VStack>
        <HStack
          mb="2"
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
            variant="unstyled"
          />
          <Heading>{t("editProfile")}</Heading>
          <IconButton
            onPress={goBackNavigationHandler}
            icon={
              <Icon as={<Feather name="x" />} size="xl" color={iconColor} />
            }
            variant="unstyled"
          />
        </HStack>
        <VStack px="10">
          <FormControl isRequired isInvalid={"name" in errors}>
            <FormControl.Label>{t("displayName")}</FormControl.Label>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <VStack>
                    <Input
                      autoFocus
                      returnKeyType="done"
                      InputRightElement={
                        <IconButton
                          onPress={() => setValue("name", "")}
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
                        leftIcon={<Icon as={<Feather name="alert-circle" />} />}
                      >
                        {errors.name && <Text>{errors.name.message}</Text>}
                      </FormControl.ErrorMessage>
                      <Text color={textColor}>{value?.length} / 20</Text>
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
              name="profile"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <VStack>
                    <Input
                      returnKeyType="done"
                      InputRightElement={
                        <IconButton
                          onPress={() => setValue("profile", "")}
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
                        leftIcon={<Icon as={<Feather name="alert-circle" />} />}
                      >
                        {errors.profile && (
                          <Text>{errors.profile.message}</Text>
                        )}
                      </FormControl.ErrorMessage>
                      <Text color={textColor}>{value?.length ?? 0} / 30</Text>
                    </HStack>
                  </VStack>
                );
              }}
              rules={{
                maxLength: {
                  value: 30,
                  message: t("profileMaxLength"),
                },
              }}
            />
          </FormControl>
        </VStack>
      </VStack>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
        automaticallyAdjustKeyboardInsets
      >
        <Button
          mx="10"
          mb="5"
          size="lg"
          rounded="xl"
          colorScheme="brand"
          isLoading={isLoadingUpdateProfile}
          onPress={handleSubmit(async (data) => {
            await updateProfile(data.name, data.profile);
          })}
        >
          <Text bold color="white" fontSize="md">
            {t("save")}
          </Text>
        </Button>
      </ScrollView>
    </Box>
  );
};

export default EditProfileTemplate;
