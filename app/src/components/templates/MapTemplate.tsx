import {
  Box,
  HStack,
  Icon,
  Pressable,
  Spinner,
  VStack,
  Text,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import SearchBar from "../organisms/SearchBar";
import CircleButton from "../molecules/CircleButton";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { LocationObject } from "expo-location";
import { useTranslation } from "react-i18next";

type MapTemplateProps = {
  type: "farm" | "rental";
  setType: Dispatch<SetStateAction<"farm" | "rental">>;
  params: {
    latitude: number | null | undefined;
    longitude: number | null | undefined;
  };
  position: LocationObject | undefined;
  farms: GetFarmsResponse | undefined;
  rentals: GetRentalsResponse | undefined;
  getCurrentPosition: () => Promise<void>;
  onRegionChange: (region: Region) => void;
  isLoadingPosition: boolean;
  rentalDetailNavigationHandler: (rentalId: number) => void;
  searchMapNavigationHandler: () => void;
};

const MapTemplate = ({
  type,
  setType,
  params,
  position,
  farms,
  rentals,
  getCurrentPosition,
  isLoadingPosition,
  onRegionChange,
  rentalDetailNavigationHandler,
  searchMapNavigationHandler,
}: MapTemplateProps) => {
  const { t } = useTranslation("map");
  const mapRef = useRef<MapView>(null);
  const [isLoading, setIsLoading] = useState(true);

  const animateToRegion = useCallback(
    (latitude: number, longitude: number) => {
      if (mapRef.current && latitude && longitude) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0005,
          longitudeDelta: 0.0005,
        });
      }
    },
    [mapRef.current]
  );

  useEffect(() => {
    !isLoading &&
      params?.latitude &&
      params?.longitude &&
      animateToRegion(params.latitude, params.longitude);
  }, [isLoading, params?.latitude, params?.longitude]);

  useEffect(() => {
    !isLoading &&
      position?.coords &&
      animateToRegion(position?.coords.latitude, position?.coords.longitude);
  }, [isLoading, position?.coords]);

  return (
    <Box flex={1}>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        mapType="satellite"
        loadingEnabled
        showsCompass={false}
        initialRegion={{
          latitude: 35,
          longitude: 135,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        onMapLoaded={() => {
          setIsLoading(false);
        }}
        style={{ flex: 1 }}
        onRegionChangeComplete={onRegionChange}
      >
        {position && <Marker coordinate={position.coords} />}
        {type === "farm"
          ? farms?.map(
              (item) =>
                item.latitude &&
                item.longitude && (
                  <Marker
                    key={item.farmId}
                    pinColor={
                      item.latitude === params?.latitude &&
                      item.longitude === params?.longitude
                        ? "tomato"
                        : "green"
                    }
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                  />
                )
            )
          : rentals?.map(
              (item) =>
                item.latitude &&
                item.longitude && (
                  <Marker
                    key={item.rentalId}
                    pinColor={
                      item.latitude === params?.latitude &&
                      item.longitude === params?.longitude
                        ? "aqua"
                        : "blue"
                    }
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                    onPress={() => rentalDetailNavigationHandler(item.rentalId)}
                  />
                )
            )}
      </MapView>
      <VStack w="80%" position="absolute" top="16" alignSelf="center" space="4">
        <SearchBar
          isReadOnly
          placeholder={t(type === "farm" ? "searchFarm" : "searchRental")}
          onPressIn={searchMapNavigationHandler}
        />
        <HStack space="2">
          <Pressable onPress={() => setType("farm")}>
            <Box
              px="3"
              py="1"
              rounded="full"
              bg={type === "farm" ? "brand.600" : "muted.200"}
              alignItems="center"
            >
              <Text color={type === "farm" ? "white" : "black"}>
                {t("farm")}
              </Text>
            </Box>
          </Pressable>
          <Pressable onPress={() => setType("rental")}>
            <Box
              px="3"
              py="1"
              rounded="full"
              bg={type === "rental" ? "brand.600" : "muted.200"}
              alignItems="center"
            >
              <Text color={type === "rental" ? "white" : "black"}>
                {t("rental")}
              </Text>
            </Box>
          </Pressable>
        </HStack>
      </VStack>
      <CircleButton
        position="absolute"
        bottom="24"
        right="6"
        onPress={getCurrentPosition}
      >
        <Icon as={<Feather />} name="navigation" size="xl" color="white" />
      </CircleButton>
      {isLoadingPosition && (
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
