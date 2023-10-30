import React, { useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

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
  useColorModeValue,
  Center,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SearchUsersResponse } from "../../hooks/user/mutate";
import SearchBar from "../organisms/SearchBar";
import SearchUserItem from "../organisms/SearchUserItem";

type PostTalkTemplateProps = {
  searchResult: SearchUsersResponse | undefined;
  hasMore: boolean | undefined;
  readMore: () => void;
  searchUsers: (query: string) => Promise<void>;
  postTalk: (recieverId: string) => Promise<void>;
  isLoading: boolean;
  isLoadingPostTalk: boolean;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  query: string;
};

const PostTalkTemplate = ({
  searchResult,
  hasMore,
  readMore,
  searchUsers,
  postTalk,
  isLoading,
  isLoadingPostTalk,
  goBackNavigationHandler,
}: PostTalkTemplateProps) => {
  const { t } = useTranslation("talk");

  const iconColor = useColorModeValue("muted.600", "muted.100");
  const textColor = useColorModeValue("muted.600", "muted.300");

  const [recieverId, setRecieverId] = useState<string>("");

  const { control, reset } = useForm<FormValues>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box flex={1} safeAreaTop>
        <HStack
          mb="2"
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
          <Heading>{t("createTalk")}</Heading>
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
                mx="8"
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
          {isLoading ? (
            <Spinner color="muted.400" />
          ) : (
            <FlatList
              contentContainerStyle={{ paddingBottom: 160 }}
              keyboardShouldPersistTaps="handled"
              data={searchResult}
              onEndReached={readMore}
              onEndReachedThreshold={0.3}
              renderItem={({ item }) => (
                <SearchUserItem
                  item={item}
                  onPress={() =>
                    setRecieverId(item.userId !== recieverId ? item.userId : "")
                  }
                  selected={item.userId === recieverId}
                />
              )}
              ListFooterComponent={
                <Center mt={hasMore ? "4" : "12"}>
                  {hasMore && <Spinner color="muted.400" />}
                </Center>
              }
              ListEmptyComponent={
                <Text bold textAlign="center" color={textColor}>
                  {t("notExistUser")}
                </Text>
              }
              keyExtractor={(item) => item.userId.toString()}
            />
          )}
        </VStack>
        {recieverId && (
          <Box w="100%" position="absolute" bottom="12">
            <Button
              mx="10"
              size="lg"
              rounded="xl"
              colorScheme="brand"
              isLoading={isLoadingPostTalk}
              onPress={async () => {
                await postTalk(recieverId);
              }}
            >
              <Text bold color="white" fontSize="md">
                {t("create")}
              </Text>
            </Button>
          </Box>
        )}
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default PostTalkTemplate;
