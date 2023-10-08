import { Feather, AntDesign, Octicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  IconButton,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useColorModeValue,
} from "native-base";
import React from "react";
import { Platform } from "react-native";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Alert, RefreshControl, useWindowDimensions } from "react-native";
import { GetFarmResponse } from "../../hooks/farm/query";
import { GetFarmLikesResponse } from "../../hooks/like/query";
import { LocationGeocodedAddress } from "expo-location";
import Avatar from "../molecules/Avatar";
import { getTimeDistance } from "../../functions";

type FarmDetailTemplateProps = {
  locale: "en" | "ja" | null;
  owned: boolean;
  liked: boolean;
  likes: GetFarmLikesResponse | undefined;
  address: LocationGeocodedAddress | undefined;
  farm: GetFarmResponse | null | undefined;
  postLike: () => Promise<void>;
  deleteLike: () => Promise<void>;
  refetch: () => Promise<void>;
  isLoading: boolean;
  isLoadingPostTalk: boolean;
  isLoadingPostLike: boolean;
  isLoadingDeleteLike: boolean;
  isRefetching: boolean;
  talkChatNavigationHandler: () => void;
  editFarmNavigationHandler: (farmId: number) => void;
  goBackNavigationHandler: () => void;
};

const FarmDetailTemplate = ({
  locale,
  owned,
  liked,
  likes,
  address,
  farm,
  postLike,
  deleteLike,
  refetch,
  isLoading,
  isLoadingPostTalk,
  isLoadingPostLike,
  isLoadingDeleteLike,
  isRefetching,
  talkChatNavigationHandler,
  editFarmNavigationHandler,
  goBackNavigationHandler,
}: FarmDetailTemplateProps) => {
  const { t } = useTranslation("map");
  const bgColor = useColorModeValue("white", "muted.800");
  const borderColor = useColorModeValue("muted.300", "muted.600");
  const imageColor = useColorModeValue("muted.200", "muted.600");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { width } = useWindowDimensions();

  return (
    <Box flex={1} safeAreaTop>
      <HStack
        mb="2"
        pl="1"
        pr="3"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          onPress={goBackNavigationHandler}
          icon={
            <Icon
              as={<Feather />}
              name="chevron-left"
              size="2xl"
              color={iconColor}
            />
          }
          variant="unstyled"
        />
        <IconButton
          onPress={() => Alert.alert(t("dev"))}
          icon={
            <Icon as={<Feather />} name="share" size="lg" color={iconColor} />
          }
          variant="unstyled"
        />
      </HStack>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {isLoading ? (
          <Skeleton w={width} h="64" />
        ) : (
          <Box h="64" bg={imageColor}>
            {farm?.device.imageUrl ? (
              <Image
                source={{
                  uri: farm.device.imageUrl + "?=" + farm.device.updatedAt,
                }}
                style={{ flex: 1 }}
              />
            ) : (
              <Icon as={<Feather />} name="image" size="lg" color={iconColor} />
            )}
          </Box>
        )}
        {isLoading ? (
          <VStack mt="2" px="6">
            <HStack alignItems="center" justifyContent="space-between">
              <Skeleton w="40" h="7" rounded="16" />
              <Skeleton size="7" rounded="full" />
            </HStack>
            <Skeleton.Text mt="12" lines={4} />
            <Skeleton.Text mt="12" lines={4} />
          </VStack>
        ) : (
          <VStack mt="6" px="6">
            <HStack alignItems="center" justifyContent="space-between">
              <VStack w="70%">
                <Heading numberOfLines={1} ellipsizeMode="tail">
                  {farm?.name}
                </Heading>
                <Text>
                  {address && (
                    <Text color="muted.400">{`${address.city} ${address.name}`}</Text>
                  )}
                </Text>
              </VStack>
              <HStack alignItems="center" space="1">
                <Avatar
                  isDisabled
                  size="7"
                  text={farm?.user?.name?.charAt(0)}
                  uri={farm?.user?.avatarUrl}
                  color={farm?.user?.color}
                  updatedAt={farm?.user?.updatedAt}
                />
                <Text w="20" numberOfLines={1} ellipsizeMode="tail">
                  {farm?.user?.name}
                </Text>
              </HStack>
            </HStack>
            <HStack mt="6" alignItems="center" justifyContent="space-between">
              <VStack>
                <Text bold color="muted.400">
                  {t("battery")}
                </Text>
                <Text bold textAlign="center">
                  {farm?.device.battery + "%" ?? t("unknown")}
                </Text>
              </VStack>
              <VStack>
                <Text bold color="muted.400">
                  {t("update")}
                </Text>
                <Text bold textAlign="center">
                  {farm?.device.updatedAt &&
                    getTimeDistance(farm.device.updatedAt, locale)}
                </Text>
              </VStack>
              <VStack>
                <Text bold color="muted.400">
                  {t("status")}
                </Text>
                <Text bold textAlign="center">
                  {farm?.privated ? t("private") : t("public")}
                </Text>
              </VStack>
              <VStack>
                <Text bold color="muted.400">
                  {t("like")}
                </Text>
                <Text bold textAlign="center">
                  {likes?.length ?? 0}
                </Text>
              </VStack>
            </HStack>
            <VStack mt="8">
              <Text bold color="muted.400">
                {t("description")}
              </Text>
              <Text bold fontSize="md">
                {farm?.description}
              </Text>
            </VStack>
            <HStack mt="8" mx="4" justifyContent="space-between">
              <VStack alignItems="center" space="1">
                <Image
                  source={require("../../../assets/temperture.png")}
                  style={{ width: 52, height: 52 }}
                  contentFit="contain"
                />
                <Text color="muted.400" bold fontSize="sm">
                  {t("temperture")}
                </Text>
                <Text bold fontSize="md">
                  {farm?.device?.temperture
                    ? farm.device.temperture + "℃"
                    : t("unknown")}
                </Text>
              </VStack>
              <VStack alignItems="center" space="1">
                <Image
                  source={require("../../../assets/humidity.png")}
                  style={{ width: 52, height: 52 }}
                  contentFit="contain"
                />
                <Text color="muted.400" bold fontSize="sm">
                  {t("humidity")}
                </Text>
                <Text bold fontSize="md">
                  {farm?.device?.humidity
                    ? farm.device.humidity + "%"
                    : t("unknown")}
                </Text>
              </VStack>
              <VStack alignItems="center" space="1">
                <Image
                  source={require("../../../assets/moisture.png")}
                  style={{ width: 52, height: 52 }}
                  contentFit="contain"
                />
                <Text color="muted.400" bold fontSize="sm">
                  {t("moisture")}
                </Text>
                <Text bold fontSize="md">
                  {farm?.device?.moisture
                    ? farm.device.moisture + "℃"
                    : t("unknown")}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        )}
      </ScrollView>
      {!isLoading && (
        <HStack
          w="100%"
          pt="2"
          pb={Platform.OS === "android" ? "2" : "9"}
          px="6"
          space="2"
          shadow="2"
          borderColor={borderColor}
          borderTopWidth="0.5"
          bg={bgColor}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack space="5">
            <IconButton
              icon={
                <Icon
                  as={<Octicons />}
                  name="bell-fill"
                  size="md"
                  color="muted.300"
                />
              }
              variant="unstyled"
              borderWidth="1"
              rounded="lg"
              borderColor={borderColor}
            />
            <IconButton
              icon={
                <Icon
                  as={<AntDesign />}
                  name="heart"
                  size="md"
                  color={liked ? "red.400" : "muted.300"}
                />
              }
              onPress={() => {
                !liked ? postLike() : deleteLike();
              }}
              isDisabled={isLoadingPostLike || isLoadingDeleteLike}
              variant="unstyled"
              borderWidth="1"
              rounded="lg"
              borderColor={borderColor}
            />
          </HStack>
          <Button
            w="40"
            colorScheme="brand"
            rounded="lg"
            isLoading={isLoadingPostTalk}
            onPress={() =>
              owned
                ? farm && editFarmNavigationHandler(farm.farmId)
                : talkChatNavigationHandler()
            }
          >
            <Text bold fontSize="md" color="white">
              {owned ? t("edit") : t("chat")}
            </Text>
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default FarmDetailTemplate;
