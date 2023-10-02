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
} from "native-base";
import { Feather } from "@expo/vector-icons";
import React from "react";

import { useTranslation } from "react-i18next";
import Avatar from "../molecules/Avatar";
import { GetUserResponse } from "../../hooks/user/query";
import { Alert } from "react-native";
import ImageActionSheet from "../organisms/ImageActionSheet";

type SettingTemplateProps = {
  user: GetUserResponse | null | undefined;
  isLoadingAvatar: boolean;
  isLoadingSignOut: boolean;
  deleteAvatar: () => Promise<void>;
  signOut: () => Promise<void>;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  postRentalNavigationHandler: () => void;
  postProfileNavigationHandler: () => void;
  rentalListNavigationHandler: () => void;
  likeListNavigationHandler: () => void;
};

const SettingTemplate = ({
  user,
  isLoadingAvatar,
  isLoadingSignOut,
  deleteAvatar,
  signOut,
  pickImageByCamera,
  pickImageByLibrary,
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
      <VStack space="3">
        <Heading>{t("setting")}</Heading>
        <HStack mt="4" mb="6" alignItems="center">
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
          <VStack w="75%">
            <Text fontSize="xl" bold numberOfLines={1} ellipsizeMode="tail">
              {user?.name}
            </Text>
            <Text color="muted.600" numberOfLines={2} ellipsizeMode="tail">
              {user?.introduction}
            </Text>
          </VStack>
        </HStack>
        <Pressable
          _pressed={{
            opacity: 0.5,
          }}
          onPress={likeListNavigationHandler}
        >
          <HStack alignItems="center" justifyContent="space-between">
            <HStack p="2" space="3" alignItems="center" rounded="md">
              <Icon as={<Feather />} name="heart" size="5" />
              <Text fontSize="md">{t("likeList")}</Text>
            </HStack>
            <Icon as={<Feather />} name="chevron-right" size="5" />
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
              <Icon as={<Feather />} name="clipboard" size="5" />
              <Text fontSize="md">{t("rentalList")}</Text>
            </HStack>
            <Icon as={<Feather />} name="chevron-right" size="5" />
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
              <Icon as={<Feather />} name="camera" size="5" />
              <Text fontSize="md">{t("rentalFarm")}</Text>
            </HStack>
            <Icon as={<Feather />} name="chevron-right" size="5" />
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
              <Icon as={<Feather />} name="edit" size="5" />
              <Text fontSize="md">{t("editProfile")}</Text>
            </HStack>
            <Icon as={<Feather />} name="chevron-right" size="5" />
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
              <Icon as={<Feather />} name="log-out" size="5" />
              <Text fontSize="md">{t("signout")}</Text>
            </HStack>
            <Icon as={<Feather />} name="chevron-right" size="5" />
          </HStack>
        </Pressable>
      </VStack>
    </Box>
  );
};

export default SettingTemplate;
