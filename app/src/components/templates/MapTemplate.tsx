import {
  Box,
  HStack,
  Pressable,
  Spinner,
  VStack,
  Text,
  Center,
  useColorModeValue,
} from "native-base";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import MapView, { LatLng, Marker } from "react-native-maps";
import SearchBar from "../organisms/SearchBar";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { LocationObject } from "expo-location";
import { useTranslation } from "react-i18next";
import FarmPreviewList from "../organisms/FarmPreviewList";
import RentalPreviewList from "../organisms/RentalPreviewList";
import { GetUserResponse } from "../../hooks/user/query";
import { Image } from "expo-image";
import { Region } from "../../types";

type MapTemplateProps = {
  type: "farm" | "rental";
  setType: Dispatch<SetStateAction<"farm" | "rental">>;
  touch: boolean;
  setTouch: Dispatch<SetStateAction<boolean>>;
  region: Region | null;
  setRegion: Dispatch<SetStateAction<Region | null>>;
  position: LocationObject | undefined;
  user: GetUserResponse | null | undefined;
  farms: GetFarmsResponse | undefined;
  rentals: GetRentalsResponse | undefined;
  readMore: () => void;
  isLoading: boolean;
  farmDetailNavigationHandler: (farmId: number) => void;
  rentalDetailNavigationHandler: (rentalId: number) => void;
  searchMapNavigationHandler: () => void;
  rentalGridNavigationHandler: () => void;
};

const MapTemplate = ({
  type,
  setType,
  touch,
  setTouch,
  region,
  setRegion,
  position,
  farms,
  rentals,
  readMore,
  isLoading,
  farmDetailNavigationHandler,
  rentalDetailNavigationHandler,
  searchMapNavigationHandler,
  rentalGridNavigationHandler,
}: MapTemplateProps) => {
  const { t } = useTranslation("map");
  const mapRef = useRef<MapView>(null);
  const bgColor = useColorModeValue("white", "muted.800");

  const animateToRegion = useCallback(
    ({ latitude, longitude }: LatLng) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    },
    [mapRef.current]
  );

  useEffect(() => {
    if (region) {
      animateToRegion({
        latitude: region.latitude,
        longitude: region.longitude,
      });
    } else {
      type === "farm"
        ? farms?.length &&
          setRegion({
            regionId: farms[0].farmId,
            latitude: farms[0].latitude,
            longitude: farms[0].longitude,
          })
        : rentals?.length &&
          setRegion({
            regionId: rentals[0].rentalId,
            latitude: rentals[0].latitude,
            longitude: rentals[0].longitude,
          });
    }
  }, [mapRef.current, region, type, farms, rentals]);

  if (isLoading) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <Box flex={1}>
      <MapView
        ref={mapRef}
        userInterfaceStyle={useColorModeValue("light", "dark")}
        showsCompass={false}
        initialRegion={{
          latitude: 35,
          longitude: 135,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        style={{ flex: 1 }}
      >
        {position &&
          !farms?.some(
            (item) =>
              type === "farm" &&
              Math.floor(position.coords.latitude * 10000) ===
                Math.floor(item.latitude * 10000)
          ) &&
          !rentals?.some(
            (item) =>
              type === "rental" &&
              Math.floor(position.coords.latitude * 10000) ===
                Math.floor(item.latitude * 10000)
          ) && (
            <Marker coordinate={position.coords}>
              <VStack alignItems="center" maxW="24">
                <Text bold fontSize="xs" numberOfLines={1} ellipsizeMode="tail">
                  {t("current")}
                </Text>
                <Image
                  source={require("../../../assets/pin-red.png")}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
              </VStack>
            </Marker>
          )}
        {type === "farm"
          ? farms?.map(({ farmId, latitude, longitude, name }) => (
              <Marker
                key={farmId}
                coordinate={{
                  latitude,
                  longitude,
                }}
                onPress={() => {
                  setTouch(false);
                  region?.regionId === farmId
                    ? farmDetailNavigationHandler(farmId)
                    : setRegion({ regionId: farmId, latitude, longitude });
                }}
              >
                <VStack alignItems="center" maxW="24">
                  {farmId === region?.regionId && (
                    <Text
                      bold
                      fontSize="xs"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {name}
                    </Text>
                  )}
                  <Image
                    source={require("../../../assets/pin-brand.png")}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                  />
                </VStack>
              </Marker>
            ))
          : rentals?.map(({ rentalId, latitude, longitude, name }) => (
              <Marker
                key={rentalId}
                coordinate={{
                  latitude,
                  longitude,
                }}
                onPress={() => {
                  setTouch(false);
                  region?.regionId === rentalId
                    ? rentalDetailNavigationHandler(rentalId)
                    : setRegion({
                        regionId: rentalId,
                        latitude,
                        longitude,
                      });
                }}
              >
                <VStack alignItems="center" maxW="24">
                  {rentalId === region?.regionId && (
                    <Text
                      bold
                      fontSize="xs"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {name}
                    </Text>
                  )}
                  <Image
                    source={require("../../../assets/pin-brand.png")}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                  />
                </VStack>
              </Marker>
            ))}
      </MapView>
      <VStack w="80%" position="absolute" top="16" alignSelf="center" space="3">
        <Box shadow="1" rounded="lg">
          <SearchBar
            isReadOnly
            bg={bgColor}
            placeholder={t(type === "farm" ? "searchFarm" : "searchRental")}
            onPressIn={searchMapNavigationHandler}
          />
        </Box>
        <HStack alignItems="center" justifyContent="space-between">
          <HStack space="2">
            <Pressable
              onPress={() => {
                if (farms?.length) {
                  setRegion({
                    regionId: farms[0].farmId,
                    latitude: farms[0].latitude,
                    longitude: farms[0].longitude,
                  });
                }
                setType("farm");
              }}
            >
              <Box
                px="3"
                py="1"
                rounded="full"
                bg={type === "farm" ? "brand.600" : bgColor}
                shadow="1"
                alignItems="center"
              >
                <Text
                  color={
                    type === "farm"
                      ? "white"
                      : useColorModeValue("black", "white")
                  }
                >
                  {t("farm")}
                </Text>
              </Box>
            </Pressable>
            <Pressable
              onPress={() => {
                if (rentals?.length) {
                  setRegion({
                    regionId: rentals[0].rentalId,
                    latitude: rentals[0].latitude,
                    longitude: rentals[0].longitude,
                  });
                }
                setType("rental");
              }}
            >
              <Box
                px="3"
                py="1"
                rounded="full"
                bg={type === "rental" ? "brand.600" : bgColor}
                shadow="1"
                alignItems="center"
              >
                <Text
                  color={
                    type === "rental"
                      ? "white"
                      : useColorModeValue("black", "white")
                  }
                >
                  {t("rental")}
                </Text>
              </Box>
            </Pressable>
          </HStack>
          {type === "rental" && (
            <Pressable
              px="3"
              py="1"
              rounded="full"
              bg={bgColor}
              shadow="1"
              onPress={rentalGridNavigationHandler}
            >
              <Text>{t("list")}</Text>
            </Pressable>
          )}
        </HStack>
      </VStack>
      {type === "farm" ? (
        <FarmPreviewList
          farms={farms}
          touch={touch}
          setTouch={setTouch}
          region={region}
          setRegion={setRegion}
          farmDetailNavigationHandler={farmDetailNavigationHandler}
        />
      ) : (
        <RentalPreviewList
          rentals={rentals}
          touch={touch}
          setTouch={setTouch}
          region={region}
          setRegion={setRegion}
          readMore={readMore}
          rentalDetailNavigationHandler={rentalDetailNavigationHandler}
        />
      )}
    </Box>
  );
};

export default MapTemplate;
