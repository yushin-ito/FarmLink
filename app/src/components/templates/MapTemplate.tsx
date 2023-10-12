import {
  Box,
  HStack,
  Icon,
  Pressable,
  Spinner,
  VStack,
  Text,
  Center,
  useColorModeValue,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
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

type Region = {
  regionId: number;
  latitude: number;
  longitude: number;
};

type MapTemplateProps = {
  type: "farm" | "rental";
  setType: Dispatch<SetStateAction<"farm" | "rental">>;
  region: Region | null;
  setRegion: Dispatch<SetStateAction<Region | null>>;
  position: LocationObject | undefined;
  user: GetUserResponse | null | undefined;
  farms: GetFarmsResponse | undefined;
  rentals: GetRentalsResponse | undefined;
  isLoading: boolean;
  farmDetailNavigationHandler: (farmId: number) => void;
  rentalDetailNavigationHandler: (rentalId: number) => void;
  searchMapNavigationHandler: () => void;
};

const MapTemplate = ({
  type,
  setType,
  region,
  setRegion,
  position,
  farms,
  rentals,
  isLoading,
  farmDetailNavigationHandler,
  rentalDetailNavigationHandler,
  searchMapNavigationHandler,
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
          !farms?.some((item) => {
            if (item.latitude && item.longitude) {
              return (
                type === "farm" &&
                Math.floor(position.coords.latitude * 10000) ===
                  Math.floor(item.latitude * 10000)
              );
            }
            return false;
          }) &&
          !rentals?.some((item) => {
            if (item.latitude && item.longitude) {
              return (
                type === "rental" &&
                Math.floor(position.coords.latitude * 10000) ===
                  Math.floor(item.latitude * 10000)
              );
            }
            return false;
          }) && (
            <Marker coordinate={position.coords}>
              <VStack alignItems="center">
                <Text bold fontSize="xs">
                  {t("current")}
                </Text>
                <Icon
                  as={<MaterialIcons />}
                  name="location-pin"
                  size="lg"
                  color="red.500"
                />
              </VStack>
            </Marker>
          )}
        {type === "farm"
          ? farms?.map(
              ({ farmId, latitude, longitude, name }) =>
                latitude &&
                longitude && (
                  <Marker
                    key={farmId}
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    onPress={() =>
                      region?.regionId === farmId
                        ? farmDetailNavigationHandler(farmId)
                        : setRegion({ regionId: farmId, latitude, longitude })
                    }
                  >
                    <VStack alignItems="center">
                      {latitude === region?.latitude &&
                        longitude === region?.longitude && (
                          <Text bold fontSize="xs">
                            {name}
                          </Text>
                        )}
                      <Icon
                        as={<MaterialIcons />}
                        name="location-pin"
                        size="lg"
                        color="brand.600"
                      />
                    </VStack>
                  </Marker>
                )
            )
          : rentals?.map(
              ({ rentalId, latitude, longitude, name }) =>
                latitude &&
                longitude && (
                  <Marker
                    key={rentalId}
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    onPress={() =>
                      region?.regionId === rentalId
                        ? rentalDetailNavigationHandler(rentalId)
                        : setRegion({ regionId: rentalId, latitude, longitude })
                    }
                  >
                    <VStack alignItems="center">
                      {latitude === region?.latitude &&
                        longitude === region?.longitude && (
                          <Text bold fontSize="xs">
                            {name}
                          </Text>
                        )}
                      <Icon
                        as={<MaterialIcons />}
                        name="location-pin"
                        size="lg"
                        color="brand.600"
                      />
                    </VStack>
                  </Marker>
                )
            )}
      </MapView>
      <VStack w="80%" position="absolute" top="16" alignSelf="center" space="4">
        <Box shadow="1" rounded="lg">
          <SearchBar
            isReadOnly
            bg={bgColor}
            placeholder={t(type === "farm" ? "searchFarm" : "searchRental")}
            onPressIn={searchMapNavigationHandler}
          />
        </Box>
        <HStack space="2">
          <Pressable
            onPress={() => {
              if (farms?.length) {
                farms[0].latitude &&
                  farms[0].longitude &&
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
                rentals[0].latitude &&
                  rentals[0].longitude &&
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
      </VStack>
      {type === "farm" ? (
        <FarmPreviewList
          farms={farms}
          region={region}
          setRegion={setRegion}
          farmDetailNavigationHandler={farmDetailNavigationHandler}
        />
      ) : (
        <RentalPreviewList
          rentals={rentals}
          region={region}
          setRegion={setRegion}
          rentalDetailNavigationHandler={rentalDetailNavigationHandler}
        />
      )}
    </Box>
  );
};

export default MapTemplate;
