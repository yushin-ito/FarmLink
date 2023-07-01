import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";

import {
  Button,
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  HStack,
  IconButton,
  Icon,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type PostCommunityTemplateProps = {
  isLoading: boolean;
  postCommunity: (
    communityName: string,
    communityDiscription: string,
    category: string
  ) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  communityName: string;
  communityDiscription: string;
  category: string;
};

const PostCommunityTemplate = ({
  isLoading,
  postCommunity,
  goBackNavigationHandler,
}: PostCommunityTemplateProps) => {
  const { t } = useTranslation("community");
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const categores = [
    t("none"),
    t("vegetable"),
    t("fruit"),
    t("fertilizer"),
    t("disease"),
  ];
  const [categoryIndex, setCategoryIndex] = useState(0);

  useEffect(() => {
    setValue("category", categores[categoryIndex]);
  }, [categoryIndex]);

  return (
    <Box flex={1} safeAreaTop>
      <HStack
        w="100%"
        position="absolute"
        top="10"
        alignSelf="center"
        alignItems="center"
        justifyContent="space-between"
        bg="rgb(242, 242, 242)"
        zIndex={2}
      >
        <IconButton
          p="6"
          onPressIn={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
          variant="unstyled"
          _pressed={{
            opacity: 0.5,
          }}
        />
        <Heading textAlign="center">{t("createCommunity")}</Heading>
        <IconButton
          p="6"
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" />}
          variant="unstyled"
          _pressed={{
            opacity: 0.5,
          }}
        />
      </HStack>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box flex={1} pb="16" justifyContent="space-between">
          <VStack pt="20" px="10" space="6">
            <FormControl isInvalid={"communityName" in errors}>
              <FormControl.Label>{t("communityName")}</FormControl.Label>
              <Controller
                name="communityName"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
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
                        onChangeText={onChange}
                      />
                      <HStack mt="1" justifyContent="space-between">
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon as={<Feather name="alert-circle" />} />
                          }
                        >
                          {errors.communityName && (
                            <Text>{errors.communityName.message}</Text>
                          )}
                        </FormControl.ErrorMessage>
                        <Text color="muted.600">
                          {value?.length ? value.length : 0} / 20
                        </Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("communityNameRequired"),
                  maxLength: {
                    value: 20,
                    message: t("communityNameMaxLength"),
                  },
                }}
              />
            </FormControl>
            <FormControl isInvalid={"communityDiscription" in errors}>
              <FormControl.Label>{t("discription")}</FormControl.Label>
              <Controller
                name="communityDiscription"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        h="48"
                        multiline
                        value={value}
                        onChangeText={onChange}
                      />
                      <HStack mt="1" justifyContent="space-between">
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon as={<Feather name="alert-circle" />} />
                          }
                        >
                          {errors.communityDiscription && (
                            <Text>{errors.communityDiscription.message}</Text>
                          )}
                        </FormControl.ErrorMessage>
                        <Text color="muted.600">
                          {value?.length ? value.length : 0} / 100
                        </Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("discriptionRequired"),
                  maxLength: {
                    value: 100,
                    message: t("discriptionMaxLength"),
                  },
                }}
              />
            </FormControl>
            <VStack>
              <FormControl.Label>{t("category")}</FormControl.Label>
              <HStack pt="1" space="2">
                {categores.map((category, index) => (
                  <Button
                    key={index}
                    colorScheme={index === categoryIndex ? "brand" : undefined}
                    variant={index === categoryIndex ? undefined : "unstyled"}
                    bg={index === categoryIndex ? undefined : "muted.300"}
                    _text={
                      index === categoryIndex
                        ? undefined
                        : { color: "muted.600" }
                    }
                    onPress={() => setCategoryIndex(index)}
                  >
                    {category}
                  </Button>
                ))}
              </HStack>
            </VStack>
          </VStack>
          <Button
            mx="10"
            size="lg"
            rounded="xl"
            colorScheme="brand"
            isLoading={isLoading}
            onPress={handleSubmit((data) => {
              postCommunity(
                data.communityName,
                data.communityDiscription,
                data.category
              );
              goBackNavigationHandler();
            })}
          >
            {t("create")}
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Box>
  );
};

export default PostCommunityTemplate;
