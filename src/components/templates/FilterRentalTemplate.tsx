import React, { memo, useEffect, useState } from "react";
import { Keyboard } from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
import {
  Box,
  FormControl,
  HStack,
  Heading,
  Icon,
  Text,
  IconButton,
  Pressable,
  VStack,
  useColorModeValue,
  useDisclose,
  Button,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Equipment, Rate } from "../../types";
import Input from "../molecules/Input";
import CityActionSheet from "../organisms/CityActionSheet";
import PrefectureActionSheet from "../organisms/PrefectureActionSheet";
import RateActionSheet from "../organisms/RateActionSheet";

type FilterRentalProps = {
  prefectures: { id: number; name: string }[];
  cities: { id: number; name: string }[];
  getCities: (prefectureId: number) => Promise<void>;
  isLoadingCities: boolean;
  rentalGridNavigationHandler: ({
    option,
  }: {
    option?: {
      fee?: { min: string; max: string };
      area?: { min: string; max: string };
      rate?: Rate;
      equipment?: Equipment[];
      prefecture?: string;
      city?: string;
    };
  }) => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  fee: { min: string; max: string };
  area: { min: string; max: string };
};

const FilterRentalTemplate = memo(
  ({
    prefectures,
    cities,
    getCities,
    isLoadingCities,
    rentalGridNavigationHandler,
    goBackNavigationHandler,
  }: FilterRentalProps) => {
    const { t } = useTranslation(["map", "setting"]);

    const iconColor = useColorModeValue("muted.600", "muted.100");
    const borderColor = useColorModeValue("muted.400", "muted.200");

    const [rate, setRate] = useState<Rate>("all");
    const [prefecture, setPrefecture] = useState<{
      id: number;
      name: string;
    }>({ id: -1, name: t("map:all") });
    const [city, setCity] = useState<{
      id: number;
      name: string;
    }>({ id: -1, name: t("map:all") });

    const {
      isOpen: isOpenRateActionSheet,
      onOpen: onOpenRateActionSheet,
      onClose: onCloseRateActionSheet,
    } = useDisclose();
    const {
      isOpen: isOpenPrefectureActionSheet,
      onOpen: onOpenPrefectureActionSheet,
      onClose: onClosePrefectureActionSheet,
    } = useDisclose();
    const {
      isOpen: isOpenCityActionSheet,
      onOpen: onOpenCityActionSheet,
      onClose: onCloseCityActionSheet,
    } = useDisclose();

    const { control, handleSubmit } = useForm<FormValues>();

    useEffect(() => {
      if (prefecture.id !== -1) {
        getCities(prefecture.id);
      }
    }, [prefecture]);

    return (
      <Box flex={1} safeAreaTop>
        <RateActionSheet
          isOpen={isOpenRateActionSheet}
          onClose={onCloseRateActionSheet}
          rate={rate}
          setRate={setRate}
        />
        <PrefectureActionSheet
          isOpen={isOpenPrefectureActionSheet}
          onClose={onClosePrefectureActionSheet}
          prefectures={prefectures}
          prefecture={prefecture}
          setPrefecture={setPrefecture}
        />
        <CityActionSheet
          isOpen={isOpenCityActionSheet}
          onClose={onCloseCityActionSheet}
          cities={cities}
          city={city}
          setCity={setCity}
          isLoading={isLoadingCities}
        />
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
          <Heading>{t("filter")}</Heading>
          <IconButton
            onPress={goBackNavigationHandler}
            icon={
              <Icon as={<Feather name="x" />} size="xl" color={iconColor} />
            }
            variant="unstyled"
          />
        </HStack>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          extraScrollHeight={24}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps="handled"
        >
          <Box flex={1} pb="16" justifyContent="space-between">
            <VStack px="10" space="6">
              <VStack>
                <FormControl.Label>{t("fee") + "(円)"}</FormControl.Label>
                <HStack alignItems="center" justifyContent="space-between">
                  <FormControl w="43%">
                    <Controller
                      name="fee.min"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <Input
                            placeholder="￥0"
                            inputMode="numeric"
                            returnKeyType="done"
                            value={value}
                            onChangeText={onChange}
                          />
                        );
                      }}
                    />
                  </FormControl>
                  <Text>～</Text>
                  <FormControl w="43%">
                    <Controller
                      name="fee.max"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <Input
                            placeholder="￥999999"
                            inputMode="numeric"
                            returnKeyType="done"
                            value={value}
                            onChangeText={onChange}
                          />
                        );
                      }}
                    />
                  </FormControl>
                </HStack>
              </VStack>
              <Pressable
                onPressIn={() => {
                  onOpenRateActionSheet();
                  Keyboard.dismiss();
                }}
              >
                <FormControl.Label>{t("rate")}</FormControl.Label>
                <Input
                  isReadOnly
                  value={t(`setting:${rate}`)}
                  InputRightElement={
                    <Icon
                      as={<AntDesign name="caretdown" />}
                      size="3"
                      mr="3"
                      color="muted.400"
                    />
                  }
                  borderColor={
                    isOpenRateActionSheet ? "brand.600" : borderColor
                  }
                  onPressIn={() => {
                    onOpenRateActionSheet();
                    Keyboard.dismiss();
                  }}
                />
              </Pressable>
              <VStack>
                <FormControl.Label>{t("area") + "(㎡)"}</FormControl.Label>
                <HStack alignItems="center" justifyContent="space-between">
                  <FormControl w="43%">
                    <Controller
                      name="area.min"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <Input
                            placeholder="0"
                            inputMode="numeric"
                            returnKeyType="done"
                            value={value}
                            onChangeText={onChange}
                          />
                        );
                      }}
                    />
                  </FormControl>
                  <Text>～</Text>
                  <FormControl w="43%">
                    <Controller
                      name="area.max"
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <Input
                            placeholder="999999"
                            inputMode="numeric"
                            returnKeyType="done"
                            value={value}
                            onChangeText={onChange}
                          />
                        );
                      }}
                    />
                  </FormControl>
                </HStack>
              </VStack>
              <Pressable
                onPressIn={() => {
                  onOpenPrefectureActionSheet();
                  Keyboard.dismiss();
                }}
              >
                <FormControl.Label>{t("prefecture")}</FormControl.Label>
                <Input
                  isReadOnly
                  value={prefecture.name}
                  InputRightElement={
                    <Icon
                      as={<AntDesign name="caretdown" />}
                      size="3"
                      mr="3"
                      color="muted.400"
                    />
                  }
                  borderColor={
                    isOpenPrefectureActionSheet ? "brand.600" : borderColor
                  }
                  onPressIn={() => {
                    onOpenPrefectureActionSheet();
                    Keyboard.dismiss();
                  }}
                />
              </Pressable>
              <Pressable
                onPressIn={() => {
                  onOpenCityActionSheet();
                  Keyboard.dismiss();
                }}
              >
                <FormControl.Label>{t("city")}</FormControl.Label>
                <Input
                  isReadOnly
                  value={city.name}
                  InputRightElement={
                    <Icon
                      as={<AntDesign name="caretdown" />}
                      size="3"
                      mr="3"
                      color="muted.400"
                    />
                  }
                  borderColor={
                    isOpenCityActionSheet ? "brand.600" : borderColor
                  }
                  onPressIn={() => {
                    onOpenCityActionSheet();
                    Keyboard.dismiss();
                  }}
                />
              </Pressable>
            </VStack>
            <VStack mt="16" mx="10" space="6">
              <Button
                size="lg"
                rounded="xl"
                colorScheme="brand"
                onPress={handleSubmit((data) => {
                  rentalGridNavigationHandler({
                    option: {
                      fee: {
                        min: data.fee.min ?? "0",
                        max: data.fee.max ?? "999999",
                      },
                      area: {
                        min: data.area.min ?? "0",
                        max: data.area.max ?? "999999",
                      },
                      rate: rate === "all" ? undefined : rate,
                      prefecture:
                        prefecture.id === -1 ? undefined : prefecture.name,
                      city: city.id === -1 ? undefined : city.name,
                    },
                  });
                })}
              >
                <Text bold color="white" fontSize="md">
                  {t("search")}
                </Text>
              </Button>
              <Button
                size="lg"
                rounded="xl"
                colorScheme="brand"
                variant="outline"
                borderColor="brand.600"
                onPress={handleSubmit(() => {
                  rentalGridNavigationHandler({option: undefined});
                })}
              >
                <Text bold color="brand.600" fontSize="md">
                  {t("clear")}
                </Text>
              </Button>
            </VStack>
          </Box>
        </KeyboardAwareScrollView>
      </Box>
    );
  }
);

export default FilterRentalTemplate;
