import React, { useEffect, useRef, useState } from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";

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
  Link,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import MapView, { Marker } from "react-native-maps";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SearchDeviceResponse } from "../../hooks/device/mutate";
import { Position } from "../../hooks/sdk/useLocation";

type PostFarmTemplateProps = {
  isLoadingPostFarm: boolean;
  isLoadingPosition: boolean;
  searchResult: SearchDeviceResponse | undefined;
  position: Position | undefined;
  getCurrentPosition: () => Promise<void>;
  postFarm: (
    farmName: string,
    deviceId: string,
    description: string,
    isPrivate: boolean
  ) => Promise<void>;
  searchDevice: (query: string) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  farmName: string;
  deviceId: string;
  private: boolean;
  description: string;
};

const PostFarmTemplate = ({
  isLoadingPostFarm,
  isLoadingPosition,
  position,
  getCurrentPosition,
  searchResult,
  postFarm,
  searchDevice,
  goBackNavigationHandler,
}: PostFarmTemplateProps) => {
  const { t } = useTranslation("farm");
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const [isPrivate, setIsPrivate] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.animateToRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [position, isPrivate, isLoadingPosition]);

  return (
    <Box flex={1} safeAreaTop>
      <HStack
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        bg="muted.100"
      >
        <IconButton
          p="6"
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
          variant="unstyled"
        />
        <Heading textAlign="center">{t("createFarm")}</Heading>
        <IconButton
          p="6"
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" />}
          variant="unstyled"
        />
      </HStack>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box flex={1} pb="16" justifyContent="space-between">
          <VStack px="10" space="6">
            <FormControl isInvalid={"farmName" in errors}>
              <FormControl.Label>{t("farmName")}</FormControl.Label>
              <Controller
                name="farmName"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("farmName", "")}
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
                          {errors.farmName && (
                            <Text>{errors.farmName.message}</Text>
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
                  required: t("farmNameRequired"),
                  maxLength: {
                    value: 20,
                    message: t("farmNameMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isInvalid={"deviceId" in errors}>
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
            <HStack mt="4" alignItems="center" justifyContent="space-between">
              <Text fontSize="md" bold color="muted.600">
                {t("doPublic")}
              </Text>
              <Switch
                colorScheme="brand"
                onValueChange={(value) => setIsPrivate(!value)}
              />
            </HStack>
            {!isPrivate && (
              <VStack mt="6" space="6">
                <FormControl isInvalid={"description" in errors}>
                  <FormControl.Label>{t("discription")}</FormControl.Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <VStack>
                          <Input
                            h="48"
                            multiline
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
                            <Text color="muted.600">
                              {value?.length ? value.length : 0} / 100
                            </Text>
                          </HStack>
                        </VStack>
                      );
                    }}
                    rules={{
                      maxLength: {
                        value: 100,
                        message: t("discriptionMaxLength"),
                      },
                    }}
                  />
                </FormControl>
                <VStack space="1">
                  <HStack justifyContent="space-between">
                    <Text bold color="muted.600">
                      {t("setPosition")}
                    </Text>
                    <Link
                      _text={{ color: "brand.600" }}
                      onPress={async () => await getCurrentPosition()}
                    >
                      {t("refetch")}
                    </Link>
                  </HStack>
                  {isLoadingPosition ? (
                    <Center h="40" bg="muted.200" rounded="xl">
                      <Spinner color="muted.400" />
                    </Center>
                  ) : (
                    <MapView
                      ref={mapRef}
                      mapType="hybrid"
                      style={{
                        width: "100%",
                        height: 160,
                        borderRadius: 12,
                        opacity: isLoadingPosition ? 0.5 : 1,
                      }}
                      loadingBackgroundColor="#e5e5e5"
                      loadingEnabled
                      showsCompass={false}
                    >
                      {position && (
                        <Marker coordinate={position.coords}>
                          <Icon
                            as={<MaterialIcons />}
                            name="location-pin"
                            size="xl"
                            color="red.500"
                          />
                        </Marker>
                      )}
                    </MapView>
                  )}
                  {!isLoadingPosition && (
                    <Text color="muted.600">{`${t("address")}: ${
                      position?.address.city
                    }${position?.address.name}`}</Text>
                  )}
                </VStack>
              </VStack>
            )}
          </VStack>
          <Button
            mt="16"
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isLoading={isLoadingPostFarm}
            onPress={handleSubmit(async (data) => {
              await postFarm(
                data.farmName,
                data.deviceId,
                data.description,
                isPrivate
              );
            })}
          >
            {t("create")}
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default PostFarmTemplate;
