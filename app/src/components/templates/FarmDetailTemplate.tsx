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
} from "native-base";
import React from "react";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Alert, RefreshControl, useWindowDimensions } from "react-native";
import { GetFarmResponse } from "../../hooks/farm/query";
import { GetFarmLikesResponse } from "../../hooks/like/query";
import { LocationGeocodedAddress } from "expo-location";
import Avatar from "../molecules/Avatar";

type FarmDetailTemplateProps = {
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
  goBackNavigationHandler: () => void;
};

const FarmDetailTemplate = ({
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
  goBackNavigationHandler,
}: FarmDetailTemplateProps) => {
  const { t } = useTranslation("farm");
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
          icon={<Icon as={<Feather />} name="chevron-left" size="2xl" />}
          variant="unstyled"
        />
        <IconButton
          onPress={() => Alert.alert(t("dev"))}
          icon={<Icon as={<Feather />} name="share" size="lg" />}
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
          <Box h="64" bg="muted.100">
            <Image
              source={{
                uri: farm?.device?.imageUrl + "?=" + farm?.device?.updatedAt,
              }}
              style={{ flex: 1 }}
              cachePolicy="memory-disk"
            />
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
              <VStack>
                <Heading numberOfLines={2} ellipsizeMode="tail">
                  {farm?.name}
                </Heading>
                <Text>
                  {address && (
                    <Text color="muted.600">{`${address.city} ${address.name}`}</Text>
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
                <Text>{farm?.user?.name}</Text>
              </HStack>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" pr="3">
              <Text>{farm?.description}</Text>
              <VStack>
                <IconButton
                  icon={
                    <Icon
                      as={<AntDesign />}
                      name={liked ? "heart" : "hearto"}
                      size="md"
                      color={liked ? "red.400" : "muted.300"}
                    />
                  }
                  variant="unstyled"
                  onPress={() => {
                    !liked ? postLike() : deleteLike();
                  }}
                  isDisabled={isLoadingPostLike || isLoadingDeleteLike}
                  pb="0"
                />
                <Text bold textAlign="center">
                  {likes?.length ?? 0}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        )}
        {!isLoading && (
          <HStack mt="9" space="10" justifyContent="center">
            <VStack alignItems="center" space="1">
              <Image
                source={require("../../../assets/temperture.png")}
                style={{ width: 52, height: 52 }}
                contentFit="contain"
                cachePolicy="memory-disk"
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
                cachePolicy="memory-disk"
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
                cachePolicy="memory-disk"
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
        )}
      </ScrollView>
      <HStack
        w="100%"
        pt="2"
        pb="8"
        px="6"
        space="2"
        shadow="2"
        borderTopRadius="3xl"
        bg="white"
        alignItems="center"
        justifyContent="space-between"
      >
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
          borderColor="muted.300"
        />
        <Button
          w="40"
          colorScheme="brand"
          rounded="lg"
          isLoading={isLoadingPostTalk}
          onPress={() =>
            owned ? Alert.alert(t("dev")) : talkChatNavigationHandler()
          }
        >
          <Text bold fontSize="md" color="white">
            {owned ? t("edit") : t("chat")}
          </Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default FarmDetailTemplate;
