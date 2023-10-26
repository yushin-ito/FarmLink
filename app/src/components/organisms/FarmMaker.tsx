import React, { useCallback } from "react";
import { Platform } from "react-native";

import { Image } from "expo-image";
import { useColorModeValue, VStack, Text } from "native-base";
import { LatLng, Marker } from "react-native-maps";

import { GetFarmsResponse } from "../../hooks/farm/query";
import { Region } from "../../types";


type FarmMaker = {
  region: Region | null;
  farms: GetFarmsResponse;
  onPress: (item: GetFarmsResponse[number]) => void;
};

const FarmMaker = ({ region, farms, onPress }: FarmMaker) => {
  const textColor = useColorModeValue("black", "white");

  const getOverlap = useCallback((a: LatLng, b: LatLng) => {
    return (
      Math.floor(a.latitude * 1000000) === Math.floor(b.latitude * 1000000) &&
      Math.floor(a.longitude * 1000000) === Math.floor(b.longitude * 1000000)
    );
  }, []);

  if (!region) {
    return null;
  }

  return (
    <>
      {farms.map(
        (item) =>
          (region.regionId === item.farmId ||
            !getOverlap(
              { latitude: region.latitude, longitude: region.longitude },
              { latitude: item.latitude, longitude: item.longitude }
            )) && (
            <Marker
              key={item.farmId}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              onPress={() => onPress(item)}
            >
              <VStack alignItems="center" maxW="24">
                {item.farmId === region.regionId && (
                  <Text
                    bold
                    fontSize="xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    color={Platform.OS === "android" ? "black" : textColor}
                  >
                    {item.name}
                  </Text>
                )}
                <Image
                  source={require("../../../assets/app/pin-brand.png")}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
              </VStack>
            </Marker>
          )
      )}
    </>
  );
};

export default FarmMaker;
