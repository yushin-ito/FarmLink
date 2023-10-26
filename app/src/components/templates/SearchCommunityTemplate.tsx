import React from "react";
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
  useColorModeValue,
  KeyboardAvoidingView,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { GetCommunitiesResponse } from "../../hooks/community/query";
import { GetUserResponse } from "../../hooks/user/query";
import SearchBar from "../organisms/SearchBar";
import SearchCommunityItem from "../organisms/SearchCommunityItem";

type SearchCommunityTemplateProps = {
  user: GetUserResponse | undefined;
  searchResult: GetCommunitiesResponse | undefined;
  searchCommunities: (query: string) => Promise<void>;
  isLoadingSearchCommunities: boolean;
  isLoadingUpdateCommunity: boolean;
  joinCommunity: (communityId: number, memberIds: string[]) => Promise<void>;
  communityChatNavigationHandler: (communityId: number) => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const SearchCommunityTemplate = ({
  user,
  searchResult,
  searchCommunities,
  isLoadingSearchCommunities,
  isLoadingUpdateCommunity,
  joinCommunity,
  communityChatNavigationHandler,
  goBackNavigationHandler,
}: SearchCommunityTemplateProps) => {
  const { t } = useTranslation("community");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { control, reset } = useForm<FormValues>();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1} pt="4" safeAreaTop>
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
                    joined={
                      user?.userId === item.ownerId ||
                      (item?.memberIds?.some(
                        (memeberId) => user?.userId === memeberId
                      ) ??
                        false)
                    }
                    joinCommunity={joinCommunity}
                    isLoading={isLoadingUpdateCommunity}
                    communityChatNavigationHandler={
                      communityChatNavigationHandler
                    }
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
