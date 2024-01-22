import React, {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { FlatList as ReactNativeFlatList } from "react-native";
import { useWindowDimensions } from "react-native";

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
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
import { useTranslation } from "react-i18next";

import { wait } from "../../functions";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { Rate, Region } from "../../types";

type RentalPreviewListProps = {
  rentals: GetRentalsResponse | undefined;
  touch: boolean;
  setTouch: Dispatch<SetStateAction<boolean>>;
  region: Region | null;
  setRegion: Dispatch<SetStateAction<Region | null>>;
  readMore: () => void;
  rentalDetailNavigationHandler: (rentalId: number) => void;
};

const RentalPreviewList = memo(
  ({
    rentals,
    touch,
    setTouch,
    region,
    setRegion,
    readMore,
    rentalDetailNavigationHandler,
  }: RentalPreviewListProps) => {
    const { t } = useTranslation("map");

    const bgColor = useColorModeValue("white", "muted.800");
    const pressedColor = useColorModeValue("muted.100", "muted.900");
    const imageColor = useColorModeValue("muted.200", "muted.600");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.500", "muted.300");

    const previewRef = useRef<ReactNativeFlatList>(null);
    const { width } = useWindowDimensions();

    const scrollToOffset = useCallback(
      async (index: number) => {
        if (previewRef.current) {
          await wait(0.1);
          previewRef.current.scrollToOffset({
            animated: true,
            offset: width * index,
          });
        }
      },
      [previewRef.current]
    );

    useEffect(() => {
      if (region && rentals && !touch) {
        const index = rentals.findIndex(
          ({ rentalId }) => rentalId === region.regionId
        );
        index !== -1 && scrollToOffset(index);
      }
    }, [previewRef.current, rentals, region, touch]);

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
                alignItems="center"
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
                  <Heading fontSize="lg" numberOfLines={1} ellipsizeMode="tail">
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
                  <HStack mt="3">
                    <VStack w="50%">
                      <Text
                        color="muted.400"
                        bold
                        fontSize="xs"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {t("area")}
                      </Text>
                      <Text color={textColor} bold fontSize="sm">
                        {item.area ? item.area + "㎡" : t("unknown")}
                      </Text>
                    </VStack>
                    <VStack w="50%">
                      <Text color="muted.400" bold fontSize="xs">
                        {t("fee")}
                      </Text>
                      <Text
                        color={textColor}
                        bold
                        fontSize="sm"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {"￥" + item.fee + t(item.rate as Rate)}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            )}
          </Pressable>
        )}
        onEndReached={readMore}
        onEndReachedThreshold={0.3}
        onScrollEndDrag={() => setTouch(true)}
        onMomentumScrollEnd={(event) => {
          const currentIndex = Math.floor(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width
          );
          if (
            rentals?.length &&
            currentIndex >= 0 &&
            currentIndex < rentals?.length &&
            touch
          ) {
            const { rentalId, latitude, longitude } = rentals[currentIndex];
            setRegion({ regionId: rentalId, latitude, longitude });
          }
        }}
      />
    );
  }
);

export default RentalPreviewList;
