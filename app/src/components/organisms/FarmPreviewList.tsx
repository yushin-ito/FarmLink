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
import { useWindowDimensions } from "react-native";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { useTranslation } from "react-i18next";
import { wait } from "../../functions";
import { Region } from "../../types";

type FarmPreviewListProps = {
  farms: GetFarmsResponse | undefined;
  touch: boolean;
  setTouch: Dispatch<SetStateAction<boolean>>;
  region: Region | null;
  setRegion: Dispatch<SetStateAction<Region | null>>;
  farmDetailNavigationHandler: (rentalId: number) => void;
};

const FarmPreviewList = memo(
  ({
    farms,
    touch,
    setTouch,
    region,
    setRegion,
    farmDetailNavigationHandler,
  }: FarmPreviewListProps) => {
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
      if (region && farms && !touch) {
        const index = farms.findIndex(
          ({ farmId }) => farmId === region.regionId
        );
        index !== -1 && scrollToOffset(index);
      }
    }, [previewRef.current, farms, region, touch]);

    return (
      <FlatList
        position="absolute"
        bottom="24"
        alignSelf="center"
        w={width}
        h="40"
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        data={farms}
        keyExtractor={(item) => item.farmId.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => farmDetailNavigationHandler(item.farmId)}>
            {({ isPressed }) => (
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
                  {item.device.imageUrl ? (
                    <Image
                      source={{ uri: item.device.imageUrl }}
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
                  <HStack mt="2" space="6">
                    <VStack>
                      <Text color="muted.400" bold fontSize="xs">
                        {t("temperture")}
                      </Text>
                      <Text color={textColor} bold fontSize="sm">
                        {item?.device?.temperture
                          ? Math.floor(item.device.temperture) + "℃"
                          : t("unknown")}
                      </Text>
                    </VStack>
                    <VStack>
                      <Text color="muted.400" bold fontSize="xs">
                        {t("humidity")}
                      </Text>
                      <Text color={textColor} bold fontSize="sm">
                        {item?.device?.humidity
                          ? Math.floor(item.device.humidity) + "%"
                          : t("unknown")}
                      </Text>
                    </VStack>
                    <VStack>
                      <Text color="muted.400" bold fontSize="xs">
                        {t("moisture")}
                      </Text>
                      <Text color={textColor} bold fontSize="sm">
                        {item?.device?.moisture
                          ? item.device.moisture
                          : t("unknown")}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            )}
          </Pressable>
        )}
        onTouchEnd={() => setTouch(true)}
        onMomentumScrollEnd={(event) => {
          const currentIndex = Math.floor(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width
          );
          if (
            farms?.length &&
            currentIndex >= 0 &&
            currentIndex < farms?.length &&
            touch
          ) {
            const { farmId, latitude, longitude } = farms[currentIndex];
            setRegion({ regionId: farmId, latitude, longitude });
          }
        }}
      />
    );
  }
);

export default FarmPreviewList;
