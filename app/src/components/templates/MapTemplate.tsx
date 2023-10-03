import {
  Box,
  HStack,
  Icon,
  Pressable,
  Spinner,
  VStack,
  Text,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import MapView, { Marker, LatLng } from "react-native-maps";
import SearchBar from "../organisms/SearchBar";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { LocationObject } from "expo-location";
import { useTranslation } from "react-i18next";
import FarmPreviewList from "../organisms/FarmPreviewList";
import RentalPreviewList from "../organisms/RentalPreviewList";
import { GetUserResponse } from "../../hooks/user/query";

type MapTemplateProps = {
  type: "farm" | "rental";
  setType: Dispatch<SetStateAction<"farm" | "rental">>;
  id: number | null;
  region: LatLng | null;
  setRegion: Dispatch<SetStateAction<LatLng | null>>;
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
  id,
  region,
  setRegion,
  position,
  user,
  farms,
  rentals,
  isLoading,
  farmDetailNavigationHandler,
  rentalDetailNavigationHandler,
  searchMapNavigationHandler,
}: MapTemplateProps) => {
  const { t } = useTranslation("map");
  const mapRef = useRef<MapView>(null);

  const animateToRegion = useCallback(
    (region: LatLng | null) => {
      if (mapRef.current && region) {
        mapRef.current.animateToRegion({
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    },
    [mapRef.current]
  );

  useEffect(() => {
    animateToRegion(region);
  }, [region, mapRef.current]);

  return (
    <Box flex={1}>
      <MapView
        ref={mapRef}
        showsCompass={false}
        initialRegion={{
          latitude: 35,
          longitude: 135,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        style={{ flex: 1 }}
      >
        {position && (
          <Marker coordinate={position.coords}>
            <VStack alignItems="center">
              <Text bold color="blueGray.600" fontSize="xs">
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
              (item) =>
                item.latitude &&
                item.longitude && (
                  <Marker
                    key={item.farmId}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                    onPress={() => farmDetailNavigationHandler(item.farmId)}
                  >
                    <VStack alignItems="center">
                      {item.latitude === region?.latitude &&
                        item.longitude === region?.longitude && (
                          <Text bold color="blueGray.600" fontSize="xs">
                            {item.name}
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
              (item) =>
                item.latitude &&
                item.longitude && (
                  <Marker
                    key={item.rentalId}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                    onPress={() => rentalDetailNavigationHandler(item.rentalId)}
                  >
                    <VStack alignItems="center">
                      {item.latitude === region?.latitude &&
                        item.longitude === region?.longitude && (
                          <Text bold color="blueGray.600" fontSize="xs">
                            {item.name}
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
        <Box shadow="1" rounded="lg" bg="white">
          <SearchBar
            isReadOnly
            bg="white"
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
              bg={type === "farm" ? "brand.600" : "white"}
              shadow="1"
              alignItems="center"
            >
              <Text color={type === "farm" ? "white" : "black"}>
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
              bg={type === "rental" ? "brand.600" : "white"}
              shadow="1"
              alignItems="center"
            >
              <Text color={type === "rental" ? "white" : "black"}>
                {t("rental")}
              </Text>
            </Box>
          </Pressable>
        </HStack>
      </VStack>
      {type === "farm"
        ? user && (
            <FarmPreviewList
              farms={farms}
              userId={user.userId}
              farmId={type === "farm" ? id : null}
              setRegion={setRegion}
              farmDetailNavigationHandler={farmDetailNavigationHandler}
            />
          )
        : user && (
            <RentalPreviewList
              rentals={rentals}
              userId={user.userId}
              rentalId={type === "rental" ? id : null}
              setRegion={setRegion}
              rentalDetailNavigationHandler={rentalDetailNavigationHandler}
            />
          )}
      {isLoading && (
        <Spinner
          position="absolute"
          top="0"
          bottom="0"
          left="0"
          right="0"
          alignItems="center"
          justifyContent="center"
          color="muted.500"
        />
      )}
    </Box>
  );
};

export default MapTemplate;
