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
} from "native-base";
import { Image } from "expo-image";
import { GetRentalResponse } from "../../hooks/rental/query";
import { Alert, RefreshControl, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { LocationGeocodedAddress } from "expo-location";
import { GetRentalLikesResponse } from "../../hooks/like/query";
import Avatar from "../molecules/Avatar";

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
  goBackNavigationHandler: () => void;
};

const RentalDetailTemplate = ({
  liked,
  likes,
  owned,
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
  goBackNavigationHandler,
}: RentalDetailTemplateProps) => {
  const { t } = useTranslation("map");
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
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
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
                <Box w={width} h="64" bg="muted.100">
                  <Image
                    source={{ uri: item }}
                    style={{ flex: 1 }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                </Box>
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
            <Center w={width} h="240" bg="muted.100">
              <Icon
                as={<Ionicons />}
                name="image-outline"
                size="6xl"
                color="muted.600"
              />
            </Center>
          )}

          <HStack w="100%" alignItems="center" justifyContent="center">
            {!isLoading &&
              rental?.imageUrls?.map((_item, index) => (
                <Box
                  key={index}
                  mr="1"
                  rounded="full"
                  size={Number(index) === currentIndex ? "1.5" : "1"}
                  bg={Number(index) === currentIndex ? "info.500" : "muted.400"}
                />
              ))}
          </HStack>
        </VStack>
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
          <VStack mt="2" px="6">
            <HStack alignItems="center" justifyContent="space-between">
              <VStack>
                <Heading numberOfLines={2} ellipsizeMode="tail">
                  {rental?.name}
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
                  text={rental?.user?.name?.charAt(0)}
                  uri={rental?.user?.avatarUrl}
                  color={rental?.user?.color}
                  updatedAt={rental?.user?.updatedAt}
                />
                <Text>{rental?.user?.name}</Text>
              </HStack>
            </HStack>
            <HStack mt="6" alignItems="center" justifyContent="space-between">
              <VStack>
                <Text color="muted.600">{t("area")}</Text>
                <Text bold fontSize="md">
                  {rental?.area ? rental.area : t("unknown")}
                </Text>
              </VStack>
              <VStack>
                <Text color="muted.600">{t("equipment")}</Text>
                <Text bold fontSize="md">
                  {rental?.equipment ? rental.equipment : t("unknown")}
                </Text>
              </VStack>
              <VStack>
                <Text color="muted.600">{t("fee")}</Text>
                <Text bold fontSize="md">
                  {rental?.fee ? rental.fee : t("unknown")}
                </Text>
              </VStack>
              <VStack>
                <Text color="muted.600">{t("like")}</Text>
                <Text bold textAlign="center">
                  {likes?.length ?? 0}
                </Text>
              </VStack>
            </HStack>
            <VStack mt="8">
              <Text color="muted.600">{t("description")}</Text>

              <Text bold fontSize="md">
                {rental?.description}
              </Text>
            </VStack>
          </VStack>
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
              as={<AntDesign />}
              name="heart"
              size="md"
              color={liked ? "red.400" : "muted.300"}
            />
          }
          variant="unstyled"
          borderWidth="1"
          rounded="lg"
          p="2"
          borderColor="muted.300"
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

export default RentalDetailTemplate;
