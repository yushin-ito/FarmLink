import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import {
  FlatList,
  Box,
  VStack,
  HStack,
  IconButton,
  Icon,
  Spinner,
  Heading,
  Text,
  Button,
  KeyboardAvoidingView,
  useColorModeValue,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SearchUserItem from "../organisms/SearchUserItem";
import { SearchUsersResponse } from "../../hooks/user/mutate";
import SearchBar from "../organisms/SearchBar";

type PostTalkTemplateProps = {
  searchResult: SearchUsersResponse | undefined;
  isLoadingSearchUsers: boolean;
  isLoadingPostTalk: boolean;
  searchUsers: (query: string) => Promise<void>;
  postTalk: (recieverId: string) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const PostTalkTemplate = ({
  searchResult,
  isLoadingSearchUsers,
  isLoadingPostTalk,
  searchUsers,
  postTalk,
  goBackNavigationHandler,
}: PostTalkTemplateProps) => {
  const { t } = useTranslation("talk");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const { control, reset } = useForm<FormValues>();
  const [recieverId, setRecieverId] = useState<string>("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 1000);
  }, [inputRef.current]);

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box flex={1} pb="10" justifyContent="space-between" safeAreaTop>
          <VStack>
            <HStack
              mb="6"
              px="2"
              alignItems="center"
              justifyContent="space-between"
            >
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
              <Heading textAlign="center">{t("createTalk")}</Heading>
              <IconButton
                onPress={goBackNavigationHandler}
                icon={
                  <Icon as={<Feather name="x" />} size="xl" color={iconColor} />
                }
                variant="unstyled"
              />
            </HStack>
            <VStack space="4">
              <Controller
                name="query"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <SearchBar
                    ref={inputRef}
                    mx="10"
                    returnKeyType="search"
                    placeholder={t("searchUser")}
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
                      searchUsers(text);
                    }}
                  />
                )}
              />
              {isLoadingSearchUsers ? (
                <Spinner color="muted.400" />
              ) : (
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={searchResult}
                  renderItem={({ item }) => (
                    <SearchUserItem
                      item={item}
                      onPress={() =>
                        setRecieverId(
                          item.userId !== recieverId ? item.userId : ""
                        )
                      }
                      selected={item.userId === recieverId}
                    />
                  )}
                  keyExtractor={(item) => item.userId.toString()}
                />
              )}
            </VStack>
          </VStack>
          <Button
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isLoading={isLoadingPostTalk}
            isDisabled={!recieverId}
            onPress={async () => {
              await postTalk(recieverId);
            }}
          >
            <Text bold color="white" fontSize="md">
              {t("create")}
            </Text>
          </Button>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PostTalkTemplate;
