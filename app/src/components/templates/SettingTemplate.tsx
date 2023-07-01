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
import ActionSheet from "../organisms/ActionSheet";

type SettingTemplateProps = {
  user: GetUserResponse | null | undefined;
  isLoadingSignOut: boolean;
  isLoadingPostAvatar: boolean;
  signOut: () => Promise<void>;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
  postProfileNavigationHandler: () => void;
};

const SettingTemplate = ({
  user,
  isLoadingSignOut,
  isLoadingPostAvatar,
  signOut,
  pickImageByCamera,
  pickImageByLibrary,
  postProfileNavigationHandler,
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
    <Box flex={1} pt="6" px="9" safeAreaTop>
      <ActionSheet
        isOpen={isOpen}
        onClose={onClose}
        pickImageByCamera={pickImageByCamera}
        pickImageByLibrary={pickImageByLibrary}
      />
      <VStack space="3">
        <Heading>{t("setting")}</Heading>
        <HStack my="4" alignItems="center">
          <Box w="30%">
            <Avatar
              text={user?.displayName?.charAt(0)}
              avatarUrl={user?.avatarUrl}
              updatedAt={user?.updatedAt}
              hue={user?.hue}
              isLoading={isLoadingPostAvatar}
              size="16"
              fontSize="2xl"
              badge={
                <Center
                  position="absolute"
                  right="-1"
                  bottom="-1"
                  bg="black"
                  opacity="0.7"
                  rounded="full"
                  p="1"
                >
                  <Icon as={<Feather />} name="camera" size="3" color="white" />
                </Center>
              }
              onPress={onOpen}
            />
          </Box>
          <VStack w="70%">
            <Text fontSize="xl" bold>
              {user?.displayName}
            </Text>
            <Text color="muted.600">{user?.introduction}</Text>
          </VStack>
        </HStack>
        <Pressable
          _pressed={{
            opacity: 0.5,
          }}
          onPress={postProfileNavigationHandler}
        >
          <HStack p="2" space="2" alignItems="center" rounded="md">
            <Icon as={<Feather name="edit" />} size="5" />
            <Text fontSize="md">{t("profile")}</Text>
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
          <HStack p="2" space="2" alignItems="center" rounded="md">
            <Icon as={<Feather name="log-out" />} size="5" />
            <Text fontSize="md">{t("signout")}</Text>
          </HStack>
        </Pressable>
      </VStack>
    </Box>
  );
};

export default SettingTemplate;
