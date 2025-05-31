import React, { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, useWindowDimensions } from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
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
  Center,
  FlatList,
  Pressable,
  useColorModeValue,
  useDisclose,
  Spinner,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, { LatLng, Marker } from "react-native-maps";

import { GetRentalResponse } from "../../hooks/rental/query";
import { Rate } from "../../types";
import Input from "../molecules/Input";
import Overlay from "../molecules/Overlay";
import RateActionSheet from "../organisms/RateActionSheet";

type EditRentalTemplateProps = {
  rental: GetRentalResponse | undefined;
  images: string[];
  position: LatLng | undefined;
  address: LocationGeocodedAddress | undefined;
  pickImageByLibrary: () => Promise<void>;
  getAddress: (latitude: number, longitude: number) => Promise<void>;
  updateRental: (
    name: string,
    description: string,
    fee: number,
    area: number,
    equipment: string,
    rate: Rate
  ) => Promise<void>;
  deleteRental: () => Promise<void>;
  isLoading: boolean;
  isLoadingUpdateRental: boolean;
  isLoadingDeleteRental: boolean;
  isLoadingPosition: boolean;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  name: string;
  fee: string;
  area: string;
  equipment: string;
  description: string;
};

const EditRentalTemplate = ({
  rental,
  images,
  position,
  address,
  pickImageByLibrary,
  getAddress,
  updateRental,
  deleteRental,
  isLoading,
  isLoadingUpdateRental,
  isLoadingDeleteRental,
  isLoadingPosition,
  goBackNavigationHandler,
}: EditRentalTemplateProps) => {
  const { t } = useTranslation("setting");

  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");
  const borderColor = useColorModeValue("muted.400", "muted.200");
  const imageColor = useColorModeValue("muted.200", "muted.600");

  const mapRef = useRef<MapView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rate, setRate] = useState<Rate>("year");
  const [isReady, setIsReady] = useState(false);

  const { width } = useWindowDimensions();
  const { isOpen, onOpen, onClose } = useDisclose();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (rental) {
      setValue("name", rental.name);
      setValue("description", rental.description);
      setValue("fee", rental.fee.toString());
      rental.equipment && setValue("equipment", rental.equipment[0]);
      rental.area && setValue("area", rental.area.toString());
      setRate(rental.rate as Rate);
    }
  }, [rental]);

  useEffect(() => {
    if (mapRef.current && position && isReady) {
      mapRef.current.animateToRegion({
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      });
      getAddress(position.latitude, position.longitude);
    }
  }, [mapRef.current, position, isReady]);

  return (
    <Box flex={1} safeAreaTop>
      <Overlay isOpen={isLoading} />
      <RateActionSheet
        pop
        isOpen={isOpen}
        onClose={onClose}
        rate={rate}
        setRate={setRate}
      />
      <HStack mb="4" px="2" alignItems="center" justifyContent="space-between">
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
        <Heading>{t("editRental")}</Heading>
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
          <VStack px="10" space="4">
            <VStack space="2">
              <FlatList
                w={width - 80}
                h="180"
                rounded="lg"
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled
                data={images}
                ListFooterComponent={
                  <Pressable onPress={pickImageByLibrary}>
                    <Center w={width - 80} h="100%" bg={imageColor}>
                      <Icon
                        as={<Feather />}
                        name="camera"
                        size="2xl"
                        color={iconColor}
                      />
                    </Center>
                  </Pressable>
                }
                renderItem={({ item }) => (
                  <Box w={width - 80} h="100%" bg={imageColor}>
                    <Image
                      source={{
                        uri:
                          item.indexOf("http") !== -1
                            ? item
                            : "data:image/png;base64," + item,
                      }}
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
                {images.map((_item, index) => (
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
                  size={(images.length ?? 0) === currentIndex ? "1.5" : "1"}
                  bg={
                    (images.length ?? 0) === currentIndex
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
                        <Text color={textColor}>{value?.length ?? 0} / 20</Text>
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
            <HStack my="4" justifyContent="space-between">
              <FormControl w="55%" isRequired isInvalid={"fee" in errors}>
                <FormControl.Label>{t("fee") + "(円)"}</FormControl.Label>
                <Controller
                  name="fee"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <VStack>
                        <Input
                          inputMode="numeric"
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
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon as={<Feather name="alert-circle" />} />
                          }
                        >
                          {errors.fee && <Text>{errors.fee.message}</Text>}
                        </FormControl.ErrorMessage>
                      </VStack>
                    );
                  }}
                  rules={{
                    required: t("feeRequired"),
                    maxLength: {
                      value: 6,
                      message: t("feeMaxLength"),
                    },
                  }}
                />
              </FormControl>
              <Pressable
                w="40%"
                onPressIn={() => {
                  onOpen();
                  Keyboard.dismiss();
                }}
              >
                <FormControl.Label>{t("rate")}</FormControl.Label>
                <Input
                  isReadOnly
                  value={t(rate)}
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
                    onOpen();
                    Keyboard.dismiss();
                  }}
                />
              </Pressable>
            </HStack>
            <FormControl isInvalid={"area" in errors}>
              <FormControl.Label>{t("area") + "(㎡)"}</FormControl.Label>
              <Controller
                name="area"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        inputMode="numeric"
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
                        <Text color={textColor}>{value?.length ?? 0} / 6</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  maxLength: {
                    value: 6,
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
                        <Text color={textColor}>{value?.length ?? 0} / 6</Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  maxLength: {
                    value: 6,
                    message: t("equipmentMaxLength"),
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
                    onMapReady={() => setIsReady(true)}
                    userInterfaceStyle={useColorModeValue("light", "dark")}
                    showsCompass={false}
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
              {address && (
                <Text color={textColor}>{`${t("address")}: ${address.city}${
                  address.name
                }`}</Text>
              )}
            </VStack>
          </VStack>
          <VStack mt="16" mx="10" space="6">
            <Button
              size="lg"
              rounded="xl"
              colorScheme="brand"
              isLoading={isLoadingUpdateRental}
              onPress={handleSubmit(async (data) => {
                await updateRental(
                  data.name,
                  data.description,
                  Number(data.fee),
                  Number(data.area),
                  data.equipment,
                  rate
                );
              })}
            >
              <Text bold color="white" fontSize="md">
                {t("save")}
              </Text>
            </Button>
            <Button
              size="lg"
              rounded="xl"
              colorScheme="brand"
              variant="outline"
              borderColor="brand.600"
              isLoading={isLoadingDeleteRental}
              onPress={() =>
                Alert.alert(t("deleteRental"), t("askDeleteRental"), [
                  {
                    text: t("cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("delete"),
                    onPress: async () => await deleteRental(),
                    style: "destructive",
                  },
                ])
              }
            >
              <Text bold color="brand.600" fontSize="md">
                {t("delete")}
              </Text>
            </Button>
          </VStack>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default EditRentalTemplate;
