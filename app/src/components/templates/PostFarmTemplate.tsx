import React, { useEffect, useRef, useState } from "react";

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LocationGeocodedAddress } from "expo-location";
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
  Switch,
  Spinner,
  Center,
  useColorModeValue,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, { LatLng, Marker } from "react-native-maps";

import { SearchDeviceResponse } from "../../hooks/device/mutate";
import Input from "../molecules/Input";

type PostFarmTemplateProps = {
  searchResult: SearchDeviceResponse[0] | undefined;
  position: LatLng | undefined;
  address: LocationGeocodedAddress | undefined;
  getAddress: (latitude: number, longitude: number) => Promise<void>;
  postFarm: (
    name: string,
    deviceId: string,
    description: string,
    privated: boolean
  ) => Promise<void>;
  searchDevice: (query: string) => Promise<void>;
  isLoadingPostFarm: boolean;
  isLoadingPosition: boolean;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  name: string;
  deviceId: string;
  description: string;
};

const PostFarmTemplate = ({
  isLoadingPostFarm,
  isLoadingPosition,
  position,
  address,
  getAddress,
  searchResult,
  postFarm,
  searchDevice,
  goBackNavigationHandler,
}: PostFarmTemplateProps) => {
  const { t } = useTranslation("farm");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const [ready, setReady] = useState(false);
  const [privated, setPrivated] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current && position && ready) {
      mapRef.current.animateToRegion({
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      });
      getAddress(position.latitude, position.longitude);
    }
  }, [mapRef.current, position, ready]);

  return (
    <Box flex={1} safeAreaTop>
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
        <Heading>{t("createFarm")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
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
            <FormControl isRequired isInvalid={"name" in errors}>
              <FormControl.Label>{t("farmName")}</FormControl.Label>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
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
                          leftIcon={
                            <Icon as={<Feather name="alert-circle" />} />
                          }
                        >
                          {errors.name && <Text>{errors.name.message}</Text>}
                        </FormControl.ErrorMessage>
                        <Text color={textColor}>{value?.length ?? 0} / 20</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("farmNameRequired"),
                  maxLength: {
                    value: 20,
                    message: t("farmNameMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isRequired isInvalid={"deviceId" in errors}>
              <FormControl.Label>{t("deviceId")}</FormControl.Label>
              <Controller
                name="deviceId"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Input
                      returnKeyType="done"
                      InputRightElement={
                        <IconButton
                          onPress={() => setValue("deviceId", "")}
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
                      onChangeText={async (text) => {
                        onChange(text);
                        await searchDevice(text);
                      }}
                    />
                  );
                }}
                rules={{
                  validate: () =>
                    searchResult ? undefined : t("invalidDeviceId"),
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<Icon as={<Feather name="alert-circle" />} />}
              >
                {errors.deviceId && <Text>{errors.deviceId.message}</Text>}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={"description" in errors}>
              <FormControl.Label>{t("description")}</FormControl.Label>
              <Controller
                name="description"
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
                          {errors.description && (
                            <Text>{errors.description.message}</Text>
                          )}
                        </FormControl.ErrorMessage>
                        <Text color={textColor}>
                          {value?.length ?? 0} / 100
                        </Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("descriptionRequired"),
                  maxLength: {
                    value: 100,
                    message: t("descriptionMaxLength"),
                  },
                }}
              />
            </FormControl>
            <VStack space="1">
              <Text bold color={textColor} fontSize="md">
                {t("setLocation")}
              </Text>
              {isLoadingPosition ? (
                <Center h="40" bg="muted.200" rounded="xl">
                  <Spinner color="muted.400" />
                </Center>
              ) : (
                <Box w="100%" h="40" rounded="xl" overflow="hidden">
                  <MapView
                    ref={mapRef}
                    userInterfaceStyle={useColorModeValue("light", "dark")}
                    showsCompass={false}
                    onMapReady={() => setReady(true)}
                    style={{ flex: 1 }}
                  >
                    {position && (
                      <Marker coordinate={position}>
                        <Image
                          source={require("../../../assets/app/pin-brand.png")}
                          style={{ width: 16, height: 16 }}
                          contentFit="contain"
                        />
                      </Marker>
                    )}
                  </MapView>
                </Box>
              )}
              {!isLoadingPosition && address && (
                <Text mt="1" color={textColor}>{`${t("address")}: ${
                  address.city
                }${address.name}`}</Text>
              )}
            </VStack>
            <HStack mt="4" alignItems="center" justifyContent="space-between">
              <Text fontSize="md" bold color={textColor}>
                {t("changePublic")}
              </Text>
              <Switch
                defaultIsChecked
                colorScheme="brand"
                onValueChange={(value) => setPrivated(!value)}
              />
            </HStack>
          </VStack>
          <Button
            mt="16"
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isDisabled={isLoadingPosition}
            isLoading={isLoadingPostFarm}
            onPress={handleSubmit(async (data) => {
              await postFarm(
                data.name,
                data.deviceId,
                data.description,
                privated
              );
            })}
          >
            <Text bold color="white" fontSize="md">
              {t("create")}
            </Text>
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default PostFarmTemplate;
