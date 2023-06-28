import { LocationObjectCoords } from "expo-location";
import { Box, Icon } from "native-base";
import { Feather } from "@expo/vector-icons";
import React from "react";
import MapView, { Marker } from "react-native-maps";
import SearchBar from "../organisms/SearchBar";
import CircleButton from "../molecules/CircleButton";

type MapTemplateProps = {
  coords: LocationObjectCoords | undefined;
};

const MapTemplate = ({ coords }: MapTemplateProps) => {
  return (
    <Box flex={1}>
      <MapView
        style={{ flex: 1, alignItems: "center" }}
        loadingEnabled
        showsCompass={false}
      >
        <SearchBar w="80%" top="12" isReadOnly onPressIn={() => {}} />
        {coords && <Marker coordinate={coords} />}
      </MapView>
      <CircleButton
        position="absolute"
        bottom="24"
        right="8"
        onPress={() => {}}
      >
        <Icon as={<Feather name="plus" />} size="4xl" color="white" />
      </CircleButton>
    </Box>
  );
};

export default MapTemplate;
