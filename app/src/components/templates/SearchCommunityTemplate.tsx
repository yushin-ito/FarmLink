import React, { useState } from "react";
import { TouchableWithoutFeedback, Keyboard, Platform } from "react-native";

import { Feather } from "@expo/vector-icons";
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Icon,
  FlatList,
  Spinner,
  Text,
  useColorModeValue,
  KeyboardAvoidingView,
  Modal,
  useDisclose,
  Button,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { GetCommunitiesResponse } from "../../hooks/community/query";
import Avatar from "../molecules/Avatar";
import SearchBar from "../organisms/SearchBar";
import SearchCommunityItem from "../organisms/SearchCommunityItem";

type SearchCommunityTemplateProps = {
  searchResult: GetCommunitiesResponse | undefined;
  searchCommunities: (query: string) => Promise<void>;
  isLoadingSearchCommunities: boolean;
  isLoadingUpdateCommunity: boolean;
  joinCommunity: (communityId: number, memberIds: string[]) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const SearchCommunityTemplate = ({
  searchResult,
  searchCommunities,
  isLoadingSearchCommunities,
  isLoadingUpdateCommunity,
  joinCommunity,
  goBackNavigationHandler,
}: SearchCommunityTemplateProps) => {
  const { t } = useTranslation("community");

  const modalColor = useColorModeValue("white", "muted.800");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const [content, setContent] = useState<GetCommunitiesResponse[number]>();

  const { isOpen, onOpen, onClose } = useDisclose();
  const { control, reset } = useForm<FormValues>();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1} pt="4" safeAreaTop>
          {content && (
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
              <VStack
                w="75%"
                px="6"
                pt="4"
                pb="2"
                bg={modalColor}
                rounded="2xl"
              >
                <Modal.CloseButton _pressed={{ bg: "transparent" }} />
                <VStack mt="6" alignItems="center" space="3">
                  <Avatar
                    size="xl"
                    fontSize="5xl"
                    disabled
                    text={content.name?.charAt(0)}
                    uri={content.imageUrl}
                    color={content.color}
                    updatedAt={content.updatedAt}
                  />
                  <VStack alignItems="center" space="2">
                    <Text bold fontSize="lg">
                      {content.name}
                    </Text>
                    <Text numberOfLines={3} ellipsizeMode="tail">
                      {content.description}
                    </Text>
                  </VStack>
                </VStack>
                <Button
                  mt="8"
                  size="lg"
                  rounded="lg"
                  colorScheme="brand"
                  isLoading={isLoadingUpdateCommunity}
                  onPress={async () => {
                    content &&
                      (await joinCommunity(
                        content.communityId,
                        content.memberIds ?? []
                      ));
                    onClose();
                  }}
                >
                  <Text bold fontSize="md" color="white">
                    {t("join")}
                  </Text>
                </Button>
                <Button mt="2" variant="unstyled" onPress={onClose}>
                  <Text bold fontSize="md" color="brand.600">
                    {t("cancel")}
                  </Text>
                </Button>
              </VStack>
            </Modal>
          )}
          <VStack space="7">
            <HStack px="5" alignItems="center" justifyContent="space-between">
              <Controller
                name="query"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <SearchBar
                    w="90%"
                    autoFocus={Platform.OS === "ios"}
                    returnKeyType="search"
                    placeholder={t("searchCommunity")}
                    InputRightElement={
                      <IconButton
                        onPress={() => reset()}
                        icon={
                          <Icon
                            as={<Feather name="x" />}
                            size="4"
                            color="muted.400"
                          />
                        }
                        variant="unstyled"
                        _pressed={{
                          opacity: 0.5,
                        }}
                      />
                    }
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      searchCommunities(text);
                    }}
                  />
                )}
              />
              <IconButton
                onPress={goBackNavigationHandler}
                icon={
                  <Icon as={<Feather name="x" />} size="6" color={iconColor} />
                }
                variant="unstyled"
                _pressed={{
                  opacity: 0.5,
                }}
              />
            </HStack>
            {isLoadingSearchCommunities ? (
              <Spinner color="muted.400" />
            ) : (
              <FlatList
                contentContainerStyle={{ paddingBottom: 64 }}
                keyboardShouldPersistTaps="handled"
                data={searchResult}
                renderItem={({ item }) => (
                  <SearchCommunityItem
                    item={item}
                    onPress={() => {
                      setContent(item);
                      onOpen();
                    }}
                  />
                )}
                keyExtractor={(item) => item.communityId.toString()}
              />
            )}
          </VStack>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default SearchCommunityTemplate;
