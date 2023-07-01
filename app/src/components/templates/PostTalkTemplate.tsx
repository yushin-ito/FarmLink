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

type PostTalkTemplateProps = {
  isLoading: boolean;
  postTalk: (userId: string) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  TalkName: string;
};

const PostTalkTemplate = ({
  isLoading,
  postTalk,
  goBackNavigationHandler,
}: PostTalkTemplateProps) => {
  const { t } = useTranslation("talk");
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
              <Heading textAlign="center">{t("createTalk")}</Heading>
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
              <FormControl isInvalid={"TalkName" in errors}>
                <FormControl.Label>{t("search")}</FormControl.Label>
                <Controller
                  name="TalkName"
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
                            {errors.TalkName && (
                              <Text>{errors.TalkName.message}</Text>
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
              await postTalk(data.TalkName);
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

export default PostTalkTemplate;
