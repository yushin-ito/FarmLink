import { Box, Icon, Spinner } from "native-base";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import SearchBar from "../organisms/SearchBar";
import CircleButton from "../molecules/CircleButton";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { LocationObject } from "expo-location";

type MapTemplateProps = {
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
  const mapRef = useRef<MapView>(null);

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
    params?.latitude &&
      params?.longitude &&
      animateToRegion(params.latitude, params.longitude);
  }, [mapRef.current, params]);

  useEffect(() => {
    position?.coords &&
      animateToRegion(position?.coords.latitude, position?.coords.longitude);
  }, [mapRef.current, position?.coords]);

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
        style={{
          flex: 1,
          opacity: isLoadingPosition ? 0.5 : 1,
        }}
        onRegionChangeComplete={onRegionChange}
      >
        {position && <Marker coordinate={position.coords} />}
        {farms?.map(
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
        )}
        {rentals?.map(
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
      <SearchBar
        w="80%"
        position="absolute"
        top="16"
        isReadOnly
        alignSelf="center"
        onPressIn={searchMapNavigationHandler}
      />
      <CircleButton
        position="absolute"
        bottom="24"
        right="8"
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
