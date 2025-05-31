import React, { useEffect, useRef, useState } from "react";
import { Keyboard, useWindowDimensions } from "react-native";

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
  Switch,
  Spinner,
  Center,
  useColorModeValue,
  useDisclose,
  Pressable,
  FlatList,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, { LatLng, Marker } from "react-native-maps";

import { Crop } from "../../types";
import Input from "../molecules/Input";
import CropActionSheet from "../organisms/CropActionSheet";

type PostFarmTemplateProps = {
  base64: string[];
  position: LatLng | undefined;
  address: LocationGeocodedAddress | undefined;
  pickImageByLibrary: () => Promise<void>;
  getAddress: (latitude: number, longitude: number) => Promise<void>;
  postFarm: (
    name: string,
    crop: string,
    description: string,
    privated: boolean
  ) => Promise<void>;
  isLoadingPostFarm: boolean;
  isLoadingPosition: boolean;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  name: string;
  description: string;
};

const PostFarmTemplate = ({
  base64,
  position,
  address,
  pickImageByLibrary,
  getAddress,
  postFarm,
  isLoadingPostFarm,
  isLoadingPosition,
  goBackNavigationHandler,
}: PostFarmTemplateProps) => {
  const { t } = useTranslation(["farm", "crop"]);

  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");
  const borderColor = useColorModeValue("muted.400", "muted.200");
  const imageColor = useColorModeValue("muted.200", "muted.600");

  const mapRef = useRef<MapView>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [privated, setPrivated] = useState(false);
  const [crop, setCrop] = useState<Crop>("carrot");

  const { width } = useWindowDimensions();
  const { isOpen, onOpen, onClose } = useDisclose();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

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
      <CropActionSheet
        isOpen={isOpen}
        onClose={onClose}
        crop={crop}
        setCrop={setCrop}
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
            <Pressable
              onPressIn={() => {
                Keyboard.dismiss();
                onOpen();
              }}
            >
              <FormControl.Label>{t("crop")}</FormControl.Label>
              <Input
                isReadOnly
                value={t(`crop:${crop}`)}
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
                    onMapReady={() => setIsReady(true)}
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
              await postFarm(data.name, crop, data.description, privated);
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
