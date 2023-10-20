import React, { useState } from "react";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";

import {
  Box,
  HStack,
  IconButton,
  Icon,
  FlatList,
  VStack,
  Heading,
  ScrollView,
  Button,
  Text,
  Center,
  Skeleton,
  useColorModeValue,
  Pressable,
} from "native-base";
import { Image } from "expo-image";
import { GetRentalResponse } from "../../hooks/rental/query";
import {
  Alert,
  Platform,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { LocationGeocodedAddress } from "expo-location";
import { GetRentalLikesResponse } from "../../hooks/like/query";
import Avatar from "../molecules/Avatar";
import { Rate } from "../../types";

type RentalDetailTemplateProps = {
  owned: boolean;
  liked: boolean;
  likes: GetRentalLikesResponse | undefined;
  rental: GetRentalResponse | undefined;
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
  editRentalNavigationHandler: (rentalId: number) => void;
  imagePreviewNavigationHandler: (name: string, imageUrl: string) => void;
  goBackNavigationHandler: () => void;
};

const RentalDetailTemplate = ({
  owned,
  liked,
  likes,
  rental,
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
  editRentalNavigationHandler,
  imagePreviewNavigationHandler,
  goBackNavigationHandler,
}: RentalDetailTemplateProps) => {
  const { t } = useTranslation("map");
  const bgColor = useColorModeValue("white", "muted.800");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const borderColor = useColorModeValue("muted.300", "muted.600");
  const imageColor = useColorModeValue("muted.200", "muted.600");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

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
        <VStack space="2">
          {isLoading ? (
            <Skeleton w={width} h="64" />
          ) : rental?.imageUrls?.length ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              data={rental.imageUrls}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    imagePreviewNavigationHandler(rental.name, item)
                  }
                >
                  <Box w={width} h="64" bg={imageColor}>
                    <Image
                      source={{ uri: item }}
                      style={{ flex: 1 }}
                      contentFit="contain"
                    />
                  </Box>
                </Pressable>
              )}
              onMomentumScrollEnd={(event) => {
                const currentIndex = Math.floor(
                  event.nativeEvent.contentOffset.x /
                    event.nativeEvent.layoutMeasurement.width
                );
                setCurrentIndex(currentIndex);
              }}
            />
          ) : (
            <Center w={width} h="240" bg={imageColor}>
              <Icon
                as={<Ionicons />}
                name="image-outline"
                size="6xl"
                color={iconColor}
              />
            </Center>
          )}
          {!isLoading && (
            <HStack w="100%" alignItems="center" justifyContent="center">
              {rental?.imageUrls?.length ? (
                rental.imageUrls.map((_item, index) => (
                  <Box
                    key={index}
                    mr="1"
                    rounded="full"
                    size={Number(index) === currentIndex ? "1.5" : "1"}
                    bg={
                      Number(index) === currentIndex ? "info.500" : "muted.400"
                    }
                  />
                ))
              ) : (
                <Box rounded="full" size="1.5" bg="info.500" />
              )}
            </HStack>
          )}
        </VStack>
        {isLoading ? (
          <VStack mt="6" px="6">
            <HStack alignItems="center" justifyContent="space-between">
              <Skeleton w="40" h="5" rounded="16" />
              <Skeleton size="7" rounded="full" />
            </HStack>
            <Skeleton.Text mt="9" lines={4} />
            <Skeleton.Text mt="9" lines={4} />
          </VStack>
        ) : (
          <VStack mt="6" px="6">
            <HStack alignItems="center" justifyContent="space-between">
              <VStack w="70%">
                <Heading numberOfLines={1} ellipsizeMode="tail">
                  {rental?.name}
                </Heading>
                <Text>
                  {address && (
                    <Text color="muted.400">{`${address.city} ${address.name}`}</Text>
                  )}
                </Text>
              </VStack>
              <HStack alignItems="center" justifyContent="flex-end" space="2">
                <Avatar
                  isDisabled
                  size="7"
                  text={rental?.owner?.name?.charAt(0)}
                  uri={rental?.owner?.avatarUrl}
                  color={rental?.owner?.color}
                  updatedAt={rental?.owner?.updatedAt}
                />
                <Text maxW="20" numberOfLines={1} ellipsizeMode="tail">
                  {rental?.owner?.name}
                </Text>
              </HStack>
            </HStack>
            <HStack mt="6" alignItems="center" justifyContent="space-between">
              <VStack>
                <Text bold color="muted.400">
                  {t("area")}
                </Text>
                <Text bold fontSize="md">
                  {rental?.area ? rental.area + "㎡" : t("unknown")}
                </Text>
              </VStack>
              <VStack>
                <Text bold color="muted.400">
                  {t("equipment")}
                </Text>
                <Text bold fontSize="md">
                  {rental?.equipment ? rental.equipment : t("unknown")}
                </Text>
              </VStack>
              <VStack>
                <Text bold color="muted.400">
                  {t("fee")}
                </Text>
                <Text bold fontSize="md">
                  {rental?.fee
                    ? "￥" + rental.fee + t(rental.rate as Rate)
                    : t("unknown")}
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
                {rental?.description}
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
          shadow="2"
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
            variant="unstyled"
            borderWidth="1"
            rounded="lg"
            borderColor={borderColor}
            onPress={() => {
              !liked ? postLike() : deleteLike();
            }}
            isDisabled={isLoadingPostLike || isLoadingDeleteLike}
          />
          <Button
            w="40"
            colorScheme="brand"
            rounded="lg"
            isLoading={isLoadingPostTalk}
            onPress={() =>
              owned
                ? rental && editRentalNavigationHandler(rental.rentalId)
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

export default RentalDetailTemplate;
