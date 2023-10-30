import React from "react";
import { Platform } from "react-native";
import { Alert, RefreshControl, useWindowDimensions } from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LocationGeocodedAddress } from "expo-location";
import {
  Box,
  Button,
  Center,
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
import { useTranslation } from "react-i18next";

import { GetFarmResponse } from "../../hooks/farm/query";
import { GetFarmLikesResponse } from "../../hooks/like/query";
import Avatar from "../molecules/Avatar";

type FarmDetailTemplateProps = {
  owned: boolean;
  liked: boolean;
  farm: GetFarmResponse | undefined;
  likes: GetFarmLikesResponse | undefined;
  address: LocationGeocodedAddress | undefined;
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
  owned,
  liked,
  farm,
  likes,
  address,
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
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const borderColor = useColorModeValue("muted.300", "muted.600");
  const imageColor = useColorModeValue("muted.200", "muted.600");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { width } = useWindowDimensions();

  if (!(isLoading && farm)) {
    Alert.alert(t("fetchError"), t("tryAgain"), [
      {
        text: t("close"),
        style: "cancel",
        onPress: goBackNavigationHandler,
      },
    ]);

    return null;
  }

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
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={spinnerColor}
          />
        }
      >
        {isLoading ? (
          <Skeleton w={width} h="64" />
        ) : (
          <Box bg={imageColor}>
            {farm?.device.imageUrl ? (
              <Box h="64">
                <Image
                  source={{
                    uri: farm.device.imageUrl + "?=" + farm.device.updatedAt,
                  }}
                  style={{ flex: 1 }}
                />
              </Box>
            ) : (
              <Center h="64">
                <Icon
                  as={<Feather />}
                  name="image"
                  size="5xl"
                  color={iconColor}
                />
              </Center>
            )}
          </Box>
        )}
        {isLoading ? (
          <VStack mt="8" px="6">
            <HStack alignItems="center" justifyContent="space-between">
              <Skeleton w="40" h="5" rounded="16" />
              <Skeleton size="7" rounded="full" />
            </HStack>
            <Skeleton.Text mt="9" lines={4} />
            <Skeleton.Text mt="9" lines={4} />
          </VStack>
        ) : (
          <VStack mt="8" px="6">
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
              <HStack alignItems="center" space="2">
                <Avatar
                  isDisabled
                  size="7"
                  text={farm?.owner?.name?.charAt(0)}
                  uri={farm?.owner?.avatarUrl}
                  color={farm?.owner?.color}
                  updatedAt={farm?.owner?.updatedAt}
                />
                <Text maxW="20" numberOfLines={1} ellipsizeMode="tail">
                  {farm?.owner?.name}
                </Text>
              </HStack>
            </HStack>
            <HStack mt="6" alignItems="center" justifyContent="space-between">
              <VStack>
                <Text color="muted.400" bold>
                  {t("temperture")}
                </Text>
                <Text bold textAlign="center">
                  {farm?.device?.temperture
                    ? Math.floor(farm.device.temperture) + "℃"
                    : t("unknown")}
                </Text>
              </VStack>
              <VStack>
                <Text color="muted.400" bold>
                  {t("humidity")}
                </Text>
                <Text bold textAlign="center">
                  {farm?.device?.humidity
                    ? Math.floor(farm.device.humidity) + "%"
                    : t("unknown")}
                </Text>
              </VStack>
              <VStack>
                <Text color="muted.400" bold>
                  {t("moisture")}
                </Text>
                <Text bold textAlign="center">
                  {farm?.device?.moisture ? farm.device.moisture : t("unknown")}
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
          borderColor={borderColor}
          borderTopWidth="0.5"
          bg={bgColor}
          alignItems="center"
          justifyContent="space-between"
        >
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
