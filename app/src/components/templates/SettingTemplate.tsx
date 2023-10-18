import {
  Box,
  HStack,
  Heading,
  Text,
  Icon,
  VStack,
  Pressable,
  Center,
  Spinner,
  useDisclose,
  Skeleton,
  useColorModeValue,
  ScrollView,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import React from "react";

import { useTranslation } from "react-i18next";
import Avatar from "../molecules/Avatar";
import { GetUserResponse } from "../../hooks/user/query";
import { Alert, RefreshControl } from "react-native";
import ImageActionSheet from "../organisms/ImageActionSheet";
import SkeletonSetting from "../organisms/SkeletonSetting";

type SettingTemplateProps = {
  user: GetUserResponse | null | undefined;
  unread: number;
  deleteAvatar: () => Promise<void>;
  signOut: () => Promise<void>;
  refetch: () => Promise<void>;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  isLoading: boolean;
  isRefetching: boolean;
  isLoadingAvatar: boolean;
  isLoadingSignOut: boolean;
  notificationNavigationHandler: () => void;
  postRentalNavigationHandler: () => void;
  postProfileNavigationHandler: () => void;
  rentalListNavigationHandler: () => void;
  likeListNavigationHandler: () => void;
  environmentNavigationHandler: () => void;
};

const SettingTemplate = ({
  user,
  unread,
  deleteAvatar,
  signOut,
  refetch,
  pickImageByCamera,
  pickImageByLibrary,
  isLoading,
  isRefetching,
  isLoadingAvatar,
  isLoadingSignOut,
  notificationNavigationHandler,
  postRentalNavigationHandler,
  postProfileNavigationHandler,
  rentalListNavigationHandler,
  likeListNavigationHandler,
  environmentNavigationHandler,
}: SettingTemplateProps) => {
  const { t } = useTranslation("setting");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");
  const spinnerColor = useColorModeValue("#a3a3a3", "white");

  const { isOpen, onOpen, onClose } = useDisclose();

  if (isLoadingSignOut) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <Box flex={1} pt="7" px="8" safeAreaTop>
      <ImageActionSheet
        isOpen={isOpen}
        onClose={onClose}
        onDelete={deleteAvatar}
        pickImageByCamera={pickImageByCamera}
        pickImageByLibrary={pickImageByLibrary}
      />
      <Heading pb="6">{t("setting")}</Heading>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={spinnerColor}
          />
        }
      >
        <HStack mb="9" alignItems="center">
          <Box w="25%">
            <Avatar
              text={user?.name?.charAt(0)}
              uri={user?.avatarUrl}
              color={user?.color}
              isLoading={isLoadingAvatar}
              size="16"
              fontSize="3xl"
              updatedAt={user?.updatedAt}
              onPress={onOpen}
            />
          </Box>
          {isLoading ? (
            <VStack space="2">
              <Skeleton w="24" h="6" rounded="12" />
              <Skeleton w="40" h="4" rounded="9" />
            </VStack>
          ) : (
            <VStack w="75%">
              <Text fontSize="xl" bold numberOfLines={1} ellipsizeMode="tail">
                {user?.name}
              </Text>
              <Text color={textColor} numberOfLines={2} ellipsizeMode="tail">
                {!user?.profile ? t("noProfile") : user?.profile}
              </Text>
            </VStack>
          )}
        </HStack>
        {isLoading ? (
          <SkeletonSetting rows={7} />
        ) : (
          <VStack space="3">
            <Pressable
              _pressed={{
                opacity: 0.5,
              }}
              onPress={notificationNavigationHandler}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack p="2" space="3" alignItems="center" rounded="md">
                  <Icon
                    as={<Feather />}
                    name="bell"
                    size="md"
                    color={iconColor}
                  />
                  <Text fontSize="md">{t("notification")}</Text>
                </HStack>
                <HStack alignItems="center" space="2">
                  {unread !== 0 && (
                    <Center size="5" bg="brand.600" rounded="full">
                      <Text color="white" fontSize="xs">
                        {unread}
                      </Text>
                    </Center>
                  )}
                  <Icon
                    as={<Feather />}
                    name="chevron-right"
                    size="md"
                    color={iconColor}
                  />
                </HStack>
              </HStack>
            </Pressable>
            <Pressable
              _pressed={{
                opacity: 0.5,
              }}
              onPress={likeListNavigationHandler}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack p="2" space="3" alignItems="center" rounded="md">
                  <Icon
                    as={<Feather />}
                    name="heart"
                    size="md"
                    color={iconColor}
                  />
                  <Text fontSize="md">{t("likeList")}</Text>
                </HStack>
                <Icon
                  as={<Feather />}
                  name="chevron-right"
                  size="md"
                  color={iconColor}
                />
              </HStack>
            </Pressable>
            <Pressable
              _pressed={{
                opacity: 0.5,
              }}
              onPress={rentalListNavigationHandler}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack p="2" space="3" alignItems="center" rounded="md">
                  <Icon
                    as={<Feather />}
                    name="clipboard"
                    size="md"
                    color={iconColor}
                  />
                  <Text fontSize="md">{t("rentalList")}</Text>
                </HStack>
                <Icon
                  as={<Feather />}
                  name="chevron-right"
                  size="md"
                  color={iconColor}
                />
              </HStack>
            </Pressable>
            <Pressable
              _pressed={{
                opacity: 0.5,
              }}
              onPress={postRentalNavigationHandler}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack p="2" space="3" alignItems="center" rounded="md">
                  <Icon
                    as={<Feather />}
                    name="camera"
                    size="md"
                    color={iconColor}
                  />
                  <Text fontSize="md">{t("rentalFarm")}</Text>
                </HStack>
                <Icon
                  as={<Feather />}
                  name="chevron-right"
                  size="md"
                  color={iconColor}
                />
              </HStack>
            </Pressable>
            <Pressable
              _pressed={{
                opacity: 0.5,
              }}
              onPress={postProfileNavigationHandler}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack p="2" space="2" alignItems="center" rounded="md">
                  <Icon
                    as={<Feather />}
                    name="edit"
                    size="md"
                    color={iconColor}
                  />
                  <Text fontSize="md">{t("editProfile")}</Text>
                </HStack>
                <Icon
                  as={<Feather />}
                  name="chevron-right"
                  size="md"
                  color={iconColor}
                />
              </HStack>
            </Pressable>
            <Pressable
              _pressed={{
                opacity: 0.5,
              }}
              onPress={environmentNavigationHandler}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack p="2" space="2" alignItems="center" rounded="md">
                  <Icon
                    as={<Feather />}
                    name="globe"
                    size="md"
                    color={iconColor}
                  />
                  <Text fontSize="md">{t("environment")}</Text>
                </HStack>
                <Icon
                  as={<Feather />}
                  name="chevron-right"
                  size="md"
                  color={iconColor}
                />
              </HStack>
            </Pressable>
            <Pressable
              onPress={() =>
                Alert.alert(t("signout"), t("askSignout"), [
                  {
                    text: t("cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("signout"),
                    onPress: signOut,
                    style: "destructive",
                  },
                ])
              }
              _pressed={{
                opacity: 0.5,
              }}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack p="2" space="2" alignItems="center" rounded="md">
                  <Icon
                    as={<Feather />}
                    name="log-out"
                    size="md"
                    color={iconColor}
                  />
                  <Text fontSize="md">{t("signout")}</Text>
                </HStack>
                <Icon
                  as={<Feather />}
                  name="chevron-right"
                  size="md"
                  color={iconColor}
                />
              </HStack>
            </Pressable>
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
};

export default SettingTemplate;
