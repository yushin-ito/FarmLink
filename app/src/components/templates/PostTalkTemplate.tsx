import React, { useState } from "react";

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
  ScrollView,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SearchUsersResponse } from "../../hooks/user/mutate";
import SearchBar from "../organisms/SearchBar";
import SearchUserItem from "../organisms/SearchUserItem";

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
  const textColor = useColorModeValue("muted.600", "muted.300");

  const { control, reset } = useForm<FormValues>();
  const [recieverId, setRecieverId] = useState<string>("");

  return (
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
                mx="10"
                autoFocus
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
                    setRecieverId(item.userId !== recieverId ? item.userId : "")
                  }
                  selected={item.userId === recieverId}
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
                  {t("selectUser")}
                </Text>
              }
              keyExtractor={(item) => item.userId.toString()}
            />
          )}
        </VStack>
      </VStack>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{
          flex: 1,
          paddingBottom: 24,
          justifyContent: "flex-end",
        }}
        automaticallyAdjustKeyboardInsets
      >
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
      </ScrollView>
    </Box>
  );
};

export default PostTalkTemplate;
