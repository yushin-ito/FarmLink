import {
  Box,
  HStack,
  Pressable,
  VStack,
  Text,
  useColorModeValue,
  IconButton,
  Icon,
} from "native-base";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import MapView, { LatLng, Marker } from "react-native-maps";
import SearchBar from "../organisms/SearchBar";
import { GetUserResponse } from "../../hooks/user/query";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { useTranslation } from "react-i18next";
import FarmPreviewList from "../organisms/FarmPreviewList";
import RentalPreviewList from "../organisms/RentalPreviewList";
import { Image } from "expo-image";
import { Region } from "../../types";
import { Feather } from "@expo/vector-icons";
import { Platform } from "react-native";
import Overlay from "../molecules/Overlay";

type MapTemplateProps = {
  type: "rental" | "farm";
  setType: Dispatch<SetStateAction<"rental" | "farm">>;
  touch: boolean;
  setTouch: Dispatch<SetStateAction<boolean>>;
  region: Region | null;
  setRegion: Dispatch<SetStateAction<Region | null>>;
  position: LatLng | undefined;
  user: GetUserResponse | null | undefined;
  farms: GetFarmsResponse | undefined;
  rentals: GetRentalsResponse | undefined;
  refetch: () => Promise<void>;
  readMore: () => void;
  isLoading: boolean;
  isRefetching: boolean;
  rentalDetailNavigationHandler: (rentalId: number) => void;
  farmDetailNavigationHandler: (farmId: number) => void;
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
  rentals,
  farms,
  refetch,
  readMore,
  isRefetching,
  rentalDetailNavigationHandler,
  farmDetailNavigationHandler,
  searchMapNavigationHandler,
  rentalGridNavigationHandler,
}: MapTemplateProps) => {
  const { t } = useTranslation("map");
  const mapColor = useColorModeValue("light", "dark");
  const bgColor = useColorModeValue("white", "muted.800");
  const textColor = useColorModeValue("black", "white");
  const iconColor = useColorModeValue("muted.600", "muted.100");
  const pressedColor = useColorModeValue("muted.200", "muted.700");

  const mapRef = useRef<MapView>(null);
  const [ready, setReady] = useState(false);

  const getOverlap = useCallback(
    (a: LatLng, b: LatLng) =>
      Math.floor(a.latitude * 1000000) === Math.floor(b.latitude * 1000000) &&
      Math.floor(a.longitude * 1000000) === Math.floor(b.longitude * 1000000),
    []
  );

  useEffect(() => {
    if (region && mapRef.current && ready) {
      mapRef.current.animateToRegion({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      });
    }
  }, [mapRef.current, region, ready]);

  return (
    <Box flex={1}>
      <Overlay isOpen={isRefetching} showSpinner />
      <MapView
        ref={mapRef}
        userInterfaceStyle={mapColor}
        onMapReady={() => setReady(true)}
        showsCompass={false}
        initialRegion={{
          latitude: 35,
          longitude: 135,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.0001,
        }}
        style={{ flex: 1 }}
      >
        {position &&
          !rentals?.some(
            ({ latitude, longitude }) =>
              type === "rental" &&
              getOverlap(position, {
                latitude,
                longitude,
              })
          ) &&
          !farms?.some(
            ({ latitude, longitude }) =>
              type === "farm" &&
              getOverlap(position, {
                latitude,
                longitude,
              })
          ) && (
            <Marker coordinate={position}>
              <VStack alignItems="center" maxW="24">
                <Text
                  bold
                  fontSize="xs"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  color={Platform.OS === "android" ? "black" : textColor}
                >
                  {t("current")}
                </Text>
                <Image
                  source={require("../../../assets/app/pin-red.png")}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
              </VStack>
            </Marker>
          )}
        {type === "rental"
          ? rentals?.map(
              ({ rentalId, latitude, longitude, name }) =>
                region &&
                (region.regionId === rentalId ||
                  !getOverlap(
                    { latitude: region.latitude, longitude: region.longitude },
                    { latitude, longitude }
                  )) && (
                  <Marker
                    key={rentalId}
                    coordinate={{
                      latitude,
                      longitude,
                    }}
                    onPress={() => {
                      setTouch(false);
                      region.regionId === rentalId
                        ? rentalDetailNavigationHandler(rentalId)
                        : setRegion({
                            regionId: rentalId,
                            latitude,
                            longitude,
                          });
                    }}
                  >
                    <VStack alignItems="center" maxW="24">
                      {rentalId === region.regionId && (
                        <Text
                          bold
                          fontSize="xs"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          color={
                            Platform.OS === "android" ? "black" : textColor
                          }
                        >
                          {name}
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
            )
          : farms?.map(
              ({ farmId, latitude, longitude, name }) =>
                region &&
                (region.regionId === farmId ||
                  !getOverlap(
                    { latitude: region.latitude, longitude: region.longitude },
                    { latitude, longitude }
                  )) && (
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
                          color={
                            Platform.OS === "android" ? "black" : textColor
                          }
                        >
                          {name}
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
      </MapView>
      <VStack
        w="100%"
        position="absolute"
        top={Platform.OS === "android" ? "12" : "16"}
        alignItems="center"
        space="3"
      >
        <HStack alignItems="center" space="2">
          <Pressable
            w="70%"
            justifyContent="center"
            shadow="1"
            bg={bgColor}
            rounded="lg"
            onPressIn={searchMapNavigationHandler}
          >
            <SearchBar
              isReadOnly
              bg={bgColor}
              placeholder={t(type === "farm" ? "searchFarm" : "searchRental")}
              onPressIn={searchMapNavigationHandler}
            />
          </Pressable>
          <IconButton
            icon={
              <Icon
                as={<Feather />}
                name="refresh-cw"
                size="sm"
                color={iconColor}
              />
            }
            variant="unstyled"
            size="8"
            rounded="full"
            bg={bgColor}
            shadow="1"
            _pressed={{ bg: pressedColor }}
            onPress={refetch}
          />
        </HStack>
        <HStack w="80%" alignItems="center" justifyContent="space-between">
          <HStack space="2">
            <Pressable
              px="3"
              py="1"
              rounded="full"
              bg={type === "rental" ? "brand.600" : bgColor}
              shadow="1"
              onPress={() => setType("rental")}
            >
              <Text color={type === "rental" ? "white" : textColor}>
                {t("rental")}
              </Text>
            </Pressable>
            <Pressable
              px="3"
              py="1"
              bg={type === "farm" ? "brand.600" : bgColor}
              rounded="full"
              shadow="1"
              onPress={() => setType("farm")}
            >
              <Text color={type === "farm" ? "white" : textColor}>
                {t("farm")}
              </Text>
            </Pressable>
          </HStack>
          {type === "rental" && (
            <Pressable
              px="3"
              py="1"
              bg={bgColor}
              _pressed={{ bg: pressedColor }}
              rounded="full"
              shadow="1"
              onPress={rentalGridNavigationHandler}
            >
              <Text>{t("list")}</Text>
            </Pressable>
          )}
        </HStack>
      </VStack>
      {type === "rental" ? (
        <RentalPreviewList
          rentals={rentals}
          touch={touch}
          setTouch={setTouch}
          region={region}
          setRegion={setRegion}
          readMore={readMore}
          rentalDetailNavigationHandler={rentalDetailNavigationHandler}
        />
      ) : (
        <FarmPreviewList
          farms={farms}
          touch={touch}
          setTouch={setTouch}
          region={region}
          setRegion={setRegion}
          farmDetailNavigationHandler={farmDetailNavigationHandler}
        />
      )}
    </Box>
  );
};

export default MapTemplate;
