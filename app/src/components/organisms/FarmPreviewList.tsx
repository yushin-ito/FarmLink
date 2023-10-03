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
import { useWindowDimensions } from "react-native";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { LatLng } from "react-native-maps";
import { useTranslation } from "react-i18next";
import { wait } from "../../functions";

type FarmPreviewListProps = {
  farms: GetFarmsResponse | undefined;
  farmId: number | null;
  setRegion: Dispatch<SetStateAction<LatLng | null>>;
  farmDetailNavigationHandler: (rentalId: number) => void;
};

const FarmPreviewList = memo(
  ({
    farms,
    farmId,
    setRegion,
    farmDetailNavigationHandler,
  }: FarmPreviewListProps) => {
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
      const index = farms?.findIndex((item) => item.farmId === farmId);
      index && scrollToOffset(index);
    }, [farms, farmId, previewRef.current]);

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
                  {item.device?.imageUrl ? (
                    <Image
                      source={{ uri: item.device?.imageUrl }}
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
                        {t("temperture")}
                      </Text>
                      <Text color="muted.600" bold fontSize="sm">
                        {item?.device?.temperture
                          ? item.device.temperture + "℃"
                          : t("unknown")}
                      </Text>
                    </VStack>
                    <VStack alignItems="center">
                      <Text color="muted.400" bold fontSize="xs">
                        {t("humidity")}
                      </Text>
                      <Text color="muted.600" bold fontSize="sm">
                        {item?.device?.humidity
                          ? item.device.humidity + "%"
                          : t("unknown")}
                      </Text>
                    </VStack>
                    <VStack alignItems="center">
                      <Text color="muted.400" bold fontSize="xs">
                        {t("moisture")}
                      </Text>
                      <Text color="muted.600" bold fontSize="sm">
                        {item?.device?.moisture
                          ? item.device.moisture + "℃"
                          : t("unknown")}
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
            farms?.length &&
            currentIndex >= 0 &&
            currentIndex < farms?.length
          ) {
            const { latitude, longitude } = farms[currentIndex];
            latitude && longitude && setRegion({ latitude, longitude });
          }
        }}
      />
    );
  }
);

export default FarmPreviewList;
