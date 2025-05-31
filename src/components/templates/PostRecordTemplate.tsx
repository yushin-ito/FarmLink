import React, { useState } from "react";
import { Keyboard } from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
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
  Pressable,
  useDisclose,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Weather } from "../../types";
import Input from "../molecules/Input";
import WeatherActionSheet from "../organisms/WeatherActionSheet";

type PostRecordTemplateProps = {
  postRecord: (
    weather: Weather,
    work: string,
    note: string,
    pesticide: string,
    ratio: number,
    amount: string
  ) => Promise<void>;
  isLoadingPostRecord: boolean;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  weather: Weather;
  work: string;
  note: string;
  pesticide: string;
  ratio: string;
  amount: string;
};

const PostRecordTemplate = ({
  postRecord,
  isLoadingPostRecord,
  goBackNavigationHandler,
}: PostRecordTemplateProps) => {
  const { t } = useTranslation("farm");

  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");
  const borderColor = useColorModeValue("muted.400", "muted.200");

  const [weather, setWeather] = useState<Weather>("sunny");

  const { isOpen, onOpen, onClose } = useDisclose();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <Box flex={1} safeAreaTop>
      <WeatherActionSheet
        isOpen={isOpen}
        onClose={onClose}
        weather={weather}
        setWeather={setWeather}
      />
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
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
        <Heading>{t("createRecord")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={24}
        keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} pb="16" justifyContent="space-between">
          <VStack px="10" space="4">
            <HStack mb="6" justifyContent="space-between">
              <Pressable
                w="46%"
                onPressIn={() => {
                  Keyboard.dismiss();
                  onOpen();
                }}
              >
                <FormControl.Label>{t("date")}</FormControl.Label>
                <Input
                  isReadOnly
                  value={format(new Date(), "yyyy / MM / dd")}
                />
              </Pressable>
              <Pressable
                w="46%"
                onPressIn={() => {
                  Keyboard.dismiss();
                  onOpen();
                }}
              >
                <FormControl.Label>{t("weather")}</FormControl.Label>
                <Input
                  isReadOnly
                  value={t(weather)}
                  InputRightElement={
                    <Icon
                      as={<AntDesign name="caretdown" />}
                      size="3"
                      mr="3"
                      color="muted.400"
                    />
                  }
                  borderColor={isOpen ? "brand.600" : borderColor}
                  onPressIn={() => {
                    Keyboard.dismiss();
                    onOpen();
                  }}
                />
              </Pressable>
            </HStack>
            <FormControl isRequired isInvalid={"work" in errors}>
              <FormControl.Label>{t("work")}</FormControl.Label>
              <Controller
                name="work"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        autoFocus
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("work", "")}
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
                          {errors.work && <Text>{errors.work.message}</Text>}
                        </FormControl.ErrorMessage>
                        <Text color={textColor}>{value?.length ?? 0} / 20</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("workRequired"),
                  maxLength: {
                    value: 20,
                    message: t("workMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isInvalid={"note" in errors}>
              <FormControl.Label>{t("note")}</FormControl.Label>
              <Controller
                name="note"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        h="48"
                        multiline
                        textAlignVertical="top"
                        value={value}
                        onChangeText={onChange}
                      />
                      <HStack mt="1" justifyContent="space-between">
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon as={<Feather name="alert-circle" />} />
                          }
                        >
                          {errors.note && <Text>{errors.note.message}</Text>}
                        </FormControl.ErrorMessage>
                        <Text color={textColor}>
                          {value?.length ?? 0} / 100
                        </Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  maxLength: {
                    value: 100,
                    message: t("noteMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isRequired isInvalid={"pesticide" in errors}>
              <FormControl.Label>{t("pesticide")}</FormControl.Label>
              <Controller
                name="pesticide"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("pesticide", "")}
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
                          {errors.pesticide && (
                            <Text>{errors.pesticide.message}</Text>
                          )}
                        </FormControl.ErrorMessage>
                        <Text color={textColor}>{value?.length ?? 0} / 20</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("pesticideRequired"),
                  maxLength: {
                    value: 30,
                    message: t("pesticideMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={"ratio" in errors || "amount" in errors}
            >
              <HStack justifyContent="space-between">
                <VStack w="46%">
                  <FormControl.Label>{t("ratio")}</FormControl.Label>
                  <Controller
                    name="ratio"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Input
                          returnKeyType="done"
                          inputMode="numeric"
                          value={value}
                          onChangeText={onChange}
                        />
                      );
                    }}
                    rules={{
                      required: t("ratioRequired"),
                      maxLength: {
                        value: 20,
                        message: t("ratioMaxLength"),
                      },
                    }}
                  />
                </VStack>
                <VStack w="46%">
                  <FormControl.Label>{t("amount")}</FormControl.Label>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <Input
                          returnKeyType="done"
                          value={value}
                          onChangeText={onChange}
                        />
                      );
                    }}
                    rules={{
                      required: t("amountRequired"),
                      maxLength: {
                        value: 20,
                        message: t("amountMaxLength"),
                      },
                    }}
                  />
                </VStack>
              </HStack>
              <FormControl.ErrorMessage
                leftIcon={<Icon as={<Feather name="alert-circle" />} />}
              >
                {errors.ratio && <Text>{errors.ratio.message}</Text>}
              </FormControl.ErrorMessage>
              <FormControl.ErrorMessage
                leftIcon={<Icon as={<Feather name="alert-circle" />} />}
              >
                {errors.amount && <Text>{errors.amount.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
          </VStack>
          <Button
            mt="16"
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isLoading={isLoadingPostRecord}
            onPress={handleSubmit(async (data) => {
              await postRecord(
                weather,
                data.work,
                data.note,
                data.pesticide,
                Number(data.ratio),
                data.amount
              );
            })}
          >
            <Text bold color="white" fontSize="md">
              {t("save")}
            </Text>
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default PostRecordTemplate;
