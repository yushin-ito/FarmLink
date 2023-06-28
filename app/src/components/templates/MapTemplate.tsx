import { Box, Icon, Spinner } from "native-base";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import SearchBar from "../organisms/SearchBar";
import CircleButton from "../molecules/CircleButton";
import { LocationObject } from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

type MapTemplateProps = {
  position: LocationObject | undefined;
  getCurrentPosition: () => Promise<void>;
  isLoadingPosition: boolean;
};

const MapTemplate = ({
  position,
  getCurrentPosition,
  isLoadingPosition,
}: MapTemplateProps) => {
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    console.log(position);
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
        ref={mapRef}
        style={{
          flex: 1,
          opacity: isLoadingPosition ? 0.5 : 1,
        }}
        loadingEnabled
        showsCompass={false}
      >
        {position && (
          <Marker coordinate={position.coords}>
            <Icon
              as={<MaterialIcons />}
              name="location-pin"
              size="3xl"
              color="red.500"
            />
          </Marker>
        )}
      </MapView>
      <SearchBar
        w="80%"
        position="absolute"
        top="16"
        isReadOnly
        alignSelf="center"
        onPressIn={() => {}}
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
