import {
  HStack,
  Center,
  Icon,
  VStack,
  Heading,
  FlatList,
  Text,
  Pressable,
} from "native-base";
import React, {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { FlatList as ReactNativeFlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { LatLng } from "react-native-maps";
import { wait } from "../../functions";

type RentalPreviewListProps = {
  rentals: GetRentalsResponse | undefined;
  rentalId: number | null;
  setRegion: Dispatch<SetStateAction<LatLng | null>>;
  rentalDetailNavigationHandler: (rentalId: number) => void;
};

const RentalPreviewList = memo(
  ({
    rentals,
    rentalId,
    setRegion,
    rentalDetailNavigationHandler,
  }: RentalPreviewListProps) => {
    const { t } = useTranslation("map");
    const { width } = useWindowDimensions();
    const previewRef = useRef<ReactNativeFlatList>(null);

    const scrollToOffset = useCallback(
      async (index: number) => {
        if (previewRef.current) {
          await wait(0.2);
          previewRef.current.scrollToOffset({
            animated: true,
            offset: width * index,
          });
        }
      },
      [previewRef.current]
    );

    useEffect(() => {
      const index = rentals?.findIndex((item) => item.rentalId === rentalId);
      index && scrollToOffset(index);
    }, [rentals, rentalId, previewRef.current]);

    return (
      <FlatList
        ref={previewRef}
        position="absolute"
        bottom="24"
        alignSelf="center"
        w={width}
        h="40"
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        data={rentals}
        keyExtractor={(item) => item.rentalId.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => rentalDetailNavigationHandler(item.rentalId)}
          >
            {({ isPressed }) => (
              <HStack
                mx={width * 0.1}
                w={width * 0.8}
                h="32"
                p="4"
                space="4"
                rounded="xl"
                bg={isPressed ? "muted.100" : "white"}
                shadow="1"
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.98 : 1,
                    },
                  ],
                }}
              >
                <Center
                  w="24"
                  h="24"
                  rounded="md"
                  bg="muted.100"
                  overflow="hidden"
                >
                  {item.imageUrls?.length ? (
                    <Image
                      source={{ uri: item.imageUrls[0] }}
                      style={{ width: 96, height: 96 }}
                    />
                  ) : (
                    <Icon
                      as={<Feather />}
                      name="image"
                      size="2xl"
                      color="muted.600"
                    />
                  )}
                </Center>
                <VStack w="60%">
                  <Heading fontSize="lg" numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                  </Heading>
                  <Text
                    color="muted.600"
                    fontSize="xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.description ?? t("noDescription")}
                  </Text>
                  <HStack mt="2" space="6">
                    <VStack alignItems="center">
                      <Text color="muted.400" bold fontSize="xs">
                        {t("area")}
                      </Text>
                      <Text color="muted.600" bold fontSize="sm">
                        {item?.area ?? t("unknown")}
                      </Text>
                    </VStack>
                    <VStack alignItems="center">
                      <Text color="muted.400" bold fontSize="xs">
                        {t("fee")}
                      </Text>
                      <Text color="muted.600" bold fontSize="sm">
                        {item?.fee ?? t("unknown")}
                      </Text>
                    </VStack>
                    <VStack alignItems="center">
                      <Text color="muted.400" bold fontSize="xs">
                        {t("equipment")}
                      </Text>
                      <Text color="muted.600" bold fontSize="sm">
                        {item?.equipment ?? t("unknown")}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            )}
          </Pressable>
        )}
        onMomentumScrollEnd={(event) => {
          const currentIndex = Math.floor(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width
          );
          if (
            rentals?.length &&
            currentIndex >= 0 &&
            currentIndex < rentals?.length
          ) {
            const { latitude, longitude } = rentals[currentIndex];
            latitude && longitude && setRegion({ latitude, longitude });
          }
        }}
      />
    );
  }
);

export default RentalPreviewList;
