import React, { useEffect, useRef } from "react";
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
import { Position } from "../../hooks/sdk/useLocation";
import { useWindowDimensions } from "react-native";
import { Image } from "expo-image";

type PostRentalTemplateProps = {
  uri: string[];
  isLoadingPostRental: boolean;
  isLoadingPosition: boolean;
  position: Position | undefined;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  getCurrentPosition: () => Promise<void>;
  postRental: (RentalName: string, description: string) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  rentalName: string;
  description: string;
};

const PostRentalTemplate = ({
  uri,
  isLoadingPostRental,
  isLoadingPosition,
  position,
  pickImageByCamera,
  pickImageByLibrary,
  getCurrentPosition,
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

  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.animateToRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [position, isLoadingPosition]);

  return (
    <Box flex={1} safeAreaTop>
      <HStack w="100%" alignItems="center" justifyContent="space-between">
        <IconButton
          p="6"
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
          variant="unstyled"
        />
        <Heading textAlign="center">{t("rental")}</Heading>
        <IconButton
          p="6"
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
          <VStack px="10" space="6">
            <FlatList
              w={width - 80}
              h="180"
              rounded="lg"
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              data={uri}
              ListFooterComponent={
                <Pressable onPress={pickImageByLibrary}>
                  <Center w={width - 80} h="100%" bg="muted.200">
                    <Icon as={<Feather />} name="camera" size="4xl" />
                  </Center>
                </Pressable>
              }
              renderItem={({ item, index }) => (
                <Box w={width - 80} h="100%" bg="muted.200">
                  <Image
                    source={{ uri: item }}
                    style={{ flex: 1 }}
                    contentFit="contain"
                  />
                  <Text position="absolute" top="1" left="3">
                    {index + 1}
                  </Text>
                </Box>
              )}
            />
            <FormControl isInvalid={"rentalName" in errors}>
              <FormControl.Label>{t("rentalName")}</FormControl.Label>
              <Controller
                name="rentalName"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("rentalName", "")}
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
                          {errors.rentalName && (
                            <Text>{errors.rentalName.message}</Text>
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
                  required: t("rentalNameRequired"),
                  maxLength: {
                    value: 20,
                    message: t("rentalNameMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isInvalid={"description" in errors}>
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
                          {value?.length ? value.length : 0} / 100
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
          <Button
            mt="16"
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isDisabled={isLoadingPosition}
            isLoading={isLoadingPostRental}
            onPress={handleSubmit(async (data) => {
              await postRental(data.rentalName, data.description);
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