import React from "react";
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

type PostCommunityTemplateProps = {
  isLoading: boolean;
  postCommunity: (communityName: string) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  communityName: string;
};

const PostCommunityTemplate = ({
  isLoading,
  postCommunity,
  goBackNavigationHandler,
}: PostCommunityTemplateProps) => {
  const { t } = useTranslation("community");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const { height } = useWindowDimensions();

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
              <Heading textAlign="center">{t("createCommunity")}</Heading>
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
              <FormControl isInvalid={"communityName" in errors}>
                <FormControl.Label>{t("communityName")}</FormControl.Label>
                <Controller
                  name="communityName"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <VStack>
                        <Input
                          autoFocus
                          returnKeyType="done"
                          InputRightElement={
                            <IconButton
                              onPress={() => reset()}
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
                            {errors.communityName && (
                              <Text>{errors.communityName.message}</Text>
                            )}
                          </FormControl.ErrorMessage>
                          <Text color="muted.600">
                            {value?.length ? value.length : 0} / 20
                          </Text>
                        </HStack>
                      </VStack>
                    );
                  }}
                  rules={{
                    required: t("communityNameRequired"),
                    maxLength: {
                      value: 20,
                      message: t("communityNameMaxLength"),
                    },
                  }}
                />
              </FormControl>
            </VStack>
          </VStack>
          <Button
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isLoading={isLoading}
            onPress={handleSubmit(async (data) => {
              await postCommunity(data.communityName);
              goBackNavigationHandler();
            })}
          >
            {t("create")}
          </Button>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PostCommunityTemplate;
