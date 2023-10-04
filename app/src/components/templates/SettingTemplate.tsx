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
} from "native-base";
import { Feather } from "@expo/vector-icons";
import React from "react";

import { useTranslation } from "react-i18next";
import Avatar from "../molecules/Avatar";
import { GetUserResponse } from "../../hooks/user/query";
import { Alert } from "react-native";
import ImageActionSheet from "../organisms/ImageActionSheet";
import SkeletonSetting from "../organisms/SkeletonSetting";

type SettingTemplateProps = {
  user: GetUserResponse | null | undefined;
  unread: number;
  isLoading: boolean;
  isLoadingAvatar: boolean;
  isLoadingSignOut: boolean;
  deleteAvatar: () => Promise<void>;
  signOut: () => Promise<void>;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  notificationNavigationHandler: () => void;
  postRentalNavigationHandler: () => void;
  postProfileNavigationHandler: () => void;
  rentalListNavigationHandler: () => void;
  likeListNavigationHandler: () => void;
};

const SettingTemplate = ({
  user,
  unread,
  isLoading,
  isLoadingAvatar,
  isLoadingSignOut,
  deleteAvatar,
  signOut,
  pickImageByCamera,
  pickImageByLibrary,
  notificationNavigationHandler,
  postRentalNavigationHandler,
  postProfileNavigationHandler,
  rentalListNavigationHandler,
  likeListNavigationHandler,
}: SettingTemplateProps) => {
  const { t } = useTranslation("setting");
  const { isOpen, onOpen, onClose } = useDisclose();

  if (isLoadingSignOut) {
    return (
      <Center flex={1}>
        <Spinner color="muted.400" />
      </Center>
    );
  }

  return (
    <Box flex={1} pt="6" px="8" safeAreaTop>
      <ImageActionSheet
        isOpen={isOpen}
        onClose={onClose}
        onDelete={deleteAvatar}
        pickImageByCamera={pickImageByCamera}
        pickImageByLibrary={pickImageByLibrary}
      />
      <Heading mt="3">{t("setting")}</Heading>
      <HStack mt="6" mb="9" alignItems="center">
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
            <Text color="muted.600" numberOfLines={2} ellipsizeMode="tail">
              {user?.introduction ?? t("noProfile")}
            </Text>
          </VStack>
        )}
      </HStack>
      {isLoading ? (
        <SkeletonSetting rows={6} />
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
                <Icon as={<Feather />} name="bell" size="md" />
                <Text fontSize="md">{t("notification")}</Text>
              </HStack>
              <HStack alignItems="center" space="1">
                {unread !== 0 && (
                  <Center size="6" bg="brand.600" rounded="full">
                    <Text color="white">{unread}</Text>
                  </Center>
                )}
                <Icon as={<Feather />} name="chevron-right" size="md" />
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
                <Icon as={<Feather />} name="heart" size="md" />
                <Text fontSize="md">{t("likeList")}</Text>
              </HStack>
              <Icon as={<Feather />} name="chevron-right" size="md" />
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
                <Icon as={<Feather />} name="clipboard" size="md" />
                <Text fontSize="md">{t("rentalList")}</Text>
              </HStack>
              <Icon as={<Feather />} name="chevron-right" size="md" />
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
                <Icon as={<Feather />} name="camera" size="md" />
                <Text fontSize="md">{t("rentalFarm")}</Text>
              </HStack>
              <Icon as={<Feather />} name="chevron-right" size="md" />
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
                <Icon as={<Feather />} name="edit" size="md" />
                <Text fontSize="md">{t("editProfile")}</Text>
              </HStack>
              <Icon as={<Feather />} name="chevron-right" size="md" />
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
                <Icon as={<Feather />} name="log-out" size="md" />
                <Text fontSize="md">{t("signout")}</Text>
              </HStack>
              <Icon as={<Feather />} name="chevron-right" size="md" />
            </HStack>
          </Pressable>
        </VStack>
      )}
    </Box>
  );
};

export default SettingTemplate;
