import {
  HStack,
  Center,
  Icon,
  VStack,
  Heading,
  FlatList,
  Text,
  Pressable,
  useColorModeValue,
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
  userId: string;
  rentalId: number | null;
  setRegion: Dispatch<SetStateAction<LatLng | null>>;
  rentalDetailNavigationHandler: (rentalId: number) => void;
};

const RentalPreviewList = memo(
  ({
    rentals,
    userId,
    rentalId,
    setRegion,
    rentalDetailNavigationHandler,
  }: RentalPreviewListProps) => {
    const { t } = useTranslation("map");
    const bgColor = useColorModeValue("white", "muted.800");
    const pressedColor = useColorModeValue("muted.100", "muted.900");
    const imageColor = useColorModeValue("muted.200", "muted.600");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.600", "muted.100");

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
            {({ isPressed }) =>
              (!item.privated || userId === item.ownerId) && (
                <HStack
                  mx={width * 0.1}
                  w={width * 0.8}
                  h="32"
                  p="4"
                  space="4"
                  rounded="xl"
                  bg={isPressed ? pressedColor : bgColor}
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
                    bg={imageColor}
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
                        color={iconColor}
                      />
                    )}
                  </Center>
                  <VStack w="60%">
                    <Heading
                      fontSize="lg"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Heading>
                    <Text
                      color={textColor}
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
                        <Text color={textColor} bold fontSize="sm">
                          {item?.area ?? t("unknown")}
                        </Text>
                      </VStack>
                      <VStack alignItems="center">
                        <Text color="muted.400" bold fontSize="xs">
                          {t("fee")}
                        </Text>
                        <Text color={textColor} bold fontSize="sm">
                          {item?.fee ?? t("unknown")}
                        </Text>
                      </VStack>
                      <VStack alignItems="center">
                        <Text color="muted.400" bold fontSize="xs">
                          {t("equipment")}
                        </Text>
                        <Text color={textColor} bold fontSize="sm">
                          {item?.equipment ?? t("unknown")}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </HStack>
              )
            }
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
