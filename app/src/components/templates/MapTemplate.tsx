import { Box, Icon, Spinner } from "native-base";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import MapView, {
  Callout,
  Details,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import SearchBar from "../organisms/SearchBar";
import CircleButton from "../molecules/CircleButton";
import { LocationObject } from "expo-location";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { GetRentalsResponse } from "../../hooks/rental/query";

type MapTemplateProps = {
  position: LocationObject | undefined;
  farms: GetFarmsResponse | undefined;
  rentals: GetRentalsResponse | undefined;
  getCurrentPosition: () => Promise<void>;
  onRegionChange: (region: Region, details: Details) => void;
  isLoadingPosition: boolean;
  rentalDetailNavigationHandler: (rentalId: number) => void;
  searchFarmNavigationHandler: () => void;
};

const MapTemplate = ({
  position,
  farms,
  rentals,
  getCurrentPosition,
  isLoadingPosition,
  onRegionChange,
  rentalDetailNavigationHandler,
  searchFarmNavigationHandler,
}: MapTemplateProps) => {
  const mapRef = useRef<MapView>(null);

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
  }, [position]);

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
          (item, index) =>
            item.latitude &&
            item.longitude && (
              <Marker
                key={index}
                pinColor="green"
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
              />
            )
        )}
        {rentals?.map(
          (item, index) =>
            item.latitude &&
            item.longitude && (
              <Marker
                key={index}
                pinColor="blue"
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
              >
                <Callout
                  onPress={() => rentalDetailNavigationHandler(item.rentalId)}
                />
              </Marker>
            )
        )}
      </MapView>
      <SearchBar
        w="80%"
        position="absolute"
        top="16"
        isReadOnly
        alignSelf="center"
        onPressIn={searchFarmNavigationHandler}
      />
      <CircleButton
        position="absolute"
        bottom="24"
        right="8"
        onPress={async () => {
          await getCurrentPosition();
        }}
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
