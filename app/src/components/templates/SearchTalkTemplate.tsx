import React from "react";
import { Feather } from "@expo/vector-icons";

import {
  Box,
  VStack,
  HStack,
  IconButton,
  Icon,
  FlatList,
  useColorModeValue,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import SearchBar from "../organisms/SearchBar";
import { TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import SearchTalkItem from "../organisms/SearchTalkItem";
import { GetTalksResponse } from "../../hooks/talk/query";
import { useTranslation } from "react-i18next";

type SearchTalkTemplateProps = {
  searchResult: GetTalksResponse | undefined;
  searchTalks: (query: string) => Promise<void>;
  talkChatNavigationHandler: (
    talkId: number,
    recieverId: string,
    token: string | null,
    name: string
  ) => void;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const SearchTalkTemplate = ({
  searchResult,
  searchTalks,
  talkChatNavigationHandler,
  goBackNavigationHandler,
}: SearchTalkTemplateProps) => {
  const { t } = useTranslation("talk");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { control, reset } = useForm<FormValues>();

  return (
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
                  placeholder={t("searchTalk")}
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
                    searchTalks(text);
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
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={searchResult}
            renderItem={({ item }) => (
              <SearchTalkItem
                item={item}
                onPress={() =>
                  item.to.name &&
                  talkChatNavigationHandler(
                    item.talkId,
                    item.to.userId,
                    item.to.token,
                    item.to.name
                  )
                }
              />
            )}
            keyExtractor={(item) => item.talkId.toString()}
          />
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default SearchTalkTemplate;
