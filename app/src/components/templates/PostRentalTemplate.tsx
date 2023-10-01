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
  Spinner,
  Center,
  Link,
  FlatList,
  Pressable,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import MapView, { Marker } from "react-native-maps";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LocationObject, LocationGeocodedAddress } from "expo-location";

type PostRentalTemplateProps = {
  base64: string[];
  isLoadingPostRental: boolean;
  isLoadingPosition: boolean;
  position: LocationObject | undefined;
  address: LocationGeocodedAddress | undefined;
  pickImageByLibrary: () => Promise<void>;
  getCurrentPosition: () => Promise<void>;
  getAddress: (latitude: number, longitude: number) => Promise<void>;
  postRental: (
    name: string,
    description: string,
    fee: string,
    area: string,
    equipment: string
  ) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  name: string;
  fee: string;
  area: string;
  equipment: string;
  description: string;
};

const PostRentalTemplate = ({
  base64,
  isLoadingPostRental,
  isLoadingPosition,
  position,
  address,
  pickImageByLibrary,
  getCurrentPosition,
  getAddress,
  postRental,
  goBackNavigationHandler,
}: PostRentalTemplateProps) => {
  const { t } = useTranslation("setting");
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const mapRef = useRef<MapView>(null);
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.animateToRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
      getAddress(position.coords.latitude, position.coords.longitude);
    }
  }, [position, isLoadingPosition]);

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="4" px="2" alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
          variant="unstyled"
        />
        <Heading textAlign="center">{t("rental")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" />}
          variant="unstyled"
        />
      </HStack>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} pb="16" justifyContent="space-between">
          <VStack px="10" space="4">
            <VStack space="2">
              <FlatList
                w={width - 80}
                h="180"
                rounded="lg"
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled
                data={base64}
                ListFooterComponent={
                  <Pressable onPress={pickImageByLibrary}>
                    <Center w={width - 80} h="100%" bg="muted.200">
                      <Icon as={<Feather />} name="camera" size="2xl" />
                    </Center>
                  </Pressable>
                }
                renderItem={({ item }) => (
                  <Box w={width - 80} h="100%" bg="muted.200">
                    <Image
                      source={{ uri: "data:image/png;base64," + item }}
                      style={{ flex: 1 }}
                      contentFit="contain"
                    />
                  </Box>
                )}
                onMomentumScrollEnd={(event) => {
                  const currentIndex = Math.floor(
                    event.nativeEvent.contentOffset.x /
                      event.nativeEvent.layoutMeasurement.width
                  );
                  setCurrentIndex(currentIndex);
                }}
              />
              <HStack w="100%" alignItems="center" justifyContent="center">
                {base64.map((_item, index) => (
                  <Box
                    key={index}
                    mr="1"
                    rounded="full"
                    size={Number(index) === currentIndex ? "1.5" : "1"}
                    bg={
                      Number(index) === currentIndex ? "info.500" : "muted.400"
                    }
                  />
                ))}
                <Box
                  rounded="full"
                  size={(base64.length ?? 0) === currentIndex ? "1.5" : "1"}
                  bg={
                    (base64.length ?? 0) === currentIndex
                      ? "info.500"
                      : "muted.400"
                  }
                />
              </HStack>
            </VStack>
            <FormControl isRequired isInvalid={"name" in errors}>
              <FormControl.Label>{t("rentalName")}</FormControl.Label>
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
                        <Text color="muted.600">{value?.length ?? 0} / 20</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("rentalNameRequired"),
                  maxLength: {
                    value: 20,
                    message: t("rentalNameMaxLength"),
                  },
                }}
              />
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
            <FormControl isInvalid={"fee" in errors}>
              <FormControl.Label>{t("fee")}</FormControl.Label>
              <Controller
                name="fee"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("fee", "")}
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
                          {errors.fee && <Text>{errors.fee.message}</Text>}
                        </FormControl.ErrorMessage>
                        <Text color="muted.600">{value?.length ?? 0} / 20</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  maxLength: {
                    value: 20,
                    message: t("feeMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isInvalid={"area" in errors}>
              <FormControl.Label>{t("area")}</FormControl.Label>
              <Controller
                name="area"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("area", "")}
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
                          {errors.area && <Text>{errors.area.message}</Text>}
                        </FormControl.ErrorMessage>
                        <Text color="muted.600">{value?.length ?? 0} / 20</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  maxLength: {
                    value: 20,
                    message: t("areaMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isInvalid={"equipment" in errors}>
              <FormControl.Label>{t("equipment")}</FormControl.Label>
              <Controller
                name="equipment"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("equipment", "")}
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
                          {errors.equipment && (
                            <Text>{errors.equipment.message}</Text>
                          )}
                        </FormControl.ErrorMessage>
                        <Text color="muted.600">{value?.length ?? 0} / 20</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  maxLength: {
                    value: 20,
                    message: t("equipmentMaxLength"),
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
                  onPress={async () => {
                    await getCurrentPosition();
                    position &&
                      (await getAddress(
                        position?.coords.latitude,
                        position?.coords.longitude
                      ));
                  }}
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
              {!isLoadingPosition && address && (
                <Text color="muted.600">{`${t("address")}: ${address.city}${
                  address.name
                }`}</Text>
              )}
            </VStack>
          </VStack>
          <Button
            mt="16"
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isDisabled={isLoadingPosition}
            isLoading={isLoadingPostRental}
            onPress={handleSubmit(async (data) => {
              await postRental(
                data.name,
                data.description,
                data.fee,
                data.area,
                data.equipment
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

export default PostRentalTemplate;
