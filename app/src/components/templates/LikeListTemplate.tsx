import React, { Dispatch, SetStateAction } from "react";
import { RefreshControl } from "react-native";

import { Feather } from "@expo/vector-icons";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Icon,
  FlatList,
  Text,
  Pressable,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";

import { GetUserLikesResponse } from "../../hooks/like/query";
import LikeListItem from "../organisms/LikeListItem";
import SkeletonLikeList from "../organisms/SkeletonLikeList";

type LikeListTemplateProps = {
  type: "rental" | "farm";
  setType: Dispatch<SetStateAction<"rental" | "farm">>;
  likes: GetUserLikesResponse | undefined;
  deleteRentalLike: (likeId: number) => Promise<void>;
  deleteFarmLike: (farmId: number) => Promise<void>;
  refetchLikes: () => Promise<void>;
  isLoading: boolean;
  isRefetchingLikes: boolean;
  rentalDetailNavigationHandler: (rentalId: number) => void;
  farmDetailNavigationHandler: (farmId: number) => void;
  goBackNavigationHandler: () => void;
};

const LikeListTemplate = ({
  type,
  setType,
  likes,
  deleteRentalLike,
  deleteFarmLike,
  refetchLikes,
  isLoading,
  isRefetchingLikes,
  rentalDetailNavigationHandler,
  farmDetailNavigationHandler,
  goBackNavigationHandler,
}: LikeListTemplateProps) => {
  const { t } = useTranslation("setting");
  
  const bgColor = useColorModeValue("muted.200", "muted.700");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={
            <Icon
              as={<Feather name="chevron-left" />}
              size="2xl"
              color={iconColor}
            />
          }
          variant="unstyled"
        />
        <Heading textAlign="center">{t("likeList")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <Box flex={1}>
        <HStack my="2" ml="6" space="2">
          <Pressable onPress={() => setType("rental")}>
            <Box
              px="3"
              py="1"
              rounded="full"
              bg={type === "rental" ? "brand.600" : bgColor}
              alignItems="center"
            >
              <Text
                color={
                  type === "rental"
                    ? "white"
                    : useColorModeValue("black", "white")
                }
              >
                {t("rental")}
              </Text>
            </Box>
          </Pressable>
          <Pressable onPress={() => setType("farm")}>
            <Box
              px="3"
              py="1"
              rounded="full"
              bg={type === "farm" ? "brand.600" : bgColor}
              alignItems="center"
            >
              <Text
                color={
                  type === "farm"
                    ? "white"
                    : useColorModeValue("black", "white")
                }
              >
                {t("farm")}
              </Text>
            </Box>
          </Pressable>
        </HStack>
        {isLoading ? (
          <SkeletonLikeList rows={4} />
        ) : type === "rental" ? (
          <FlatList
            contentContainerStyle={{ paddingBottom: 40 }}
            data={likes?.filter((item) => item.rentalId)}
            renderItem={({ item }) => (
              <LikeListItem
                item={item}
                onPress={() =>
                  rentalDetailNavigationHandler(item.rental.rentalId)
                }
                type="rental"
                onPressRight={() =>
                  item.rentalId && deleteRentalLike(item.rentalId)
                }
              />
            )}
            ListEmptyComponent={
              <Text
                bold
                lineHeight="2xl"
                fontSize="md"
                textAlign="center"
                color={textColor}
              >
                {t("notExistRentalLike")}
              </Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingLikes}
                onRefresh={refetchLikes}
                tintColor={spinnerColor}
              />
            }
            keyExtractor={(item) => item.likeId.toString()}
          />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 40 }}
            data={likes?.filter((item) => item.farmId)}
            renderItem={({ item }) => (
              <LikeListItem
                item={item}
                onPress={() => farmDetailNavigationHandler(item.farm.farmId)}
                type="farm"
                onPressRight={() => item.farmId && deleteFarmLike(item.farmId)}
              />
            )}
            ListEmptyComponent={
              <Text
                bold
                lineHeight="2xl"
                fontSize="md"
                textAlign="center"
                color={textColor}
              >
                {t("notExistFarmLike")}
              </Text>
            }
            refreshing={isRefetchingLikes}
            onRefresh={refetchLikes}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingLikes}
                onRefresh={refetchLikes}
                tintColor={spinnerColor}
              />
            }
            keyExtractor={(item) => item.likeId.toString()}
          />
        )}
      </Box>
    </Box>
  );
};

export default LikeListTemplate;
