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
  useColorModeValue,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "../molecules/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Category, getCategories } from "../../functions";

type PostCommunityTemplateProps = {
  isLoading: boolean;
  postCommunity: (
    name: string,
    description: string,
    category: Category
  ) => Promise<void>;
  goBackNavigationHandler: () => void;
};

type FormValues = {
  name: string;
  description: string;
  category: Category;
};

const PostCommunityTemplate = ({
  isLoading,
  postCommunity,
  goBackNavigationHandler,
}: PostCommunityTemplateProps) => {
  const { t } = useTranslation("community");
  const bgColor = useColorModeValue("muted.300", "muted.700");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const [categoryIndex, setCategoryIndex] = useState(0);

  useEffect(() => {
    setValue("category", getCategories()[categoryIndex]);
  }, [categoryIndex]);

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
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
        <Heading textAlign="center">{t("createCommunity")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} pb="16" justifyContent="space-between">
          <VStack px="10" space="6">
            <FormControl isRequired isInvalid={"name" in errors}>
              <FormControl.Label>{t("communityName")}</FormControl.Label>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        returnKeyType="done"
                        InputRightElement={
                          <IconButton
                            onPress={() => setValue("name", "")}
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
                          {errors.name && <Text>{errors.name.message}</Text>}
                        </FormControl.ErrorMessage>
                        <Text color={textColor}>{value?.length ?? 0} / 20</Text>
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
            <FormControl isRequired isInvalid={"description" in errors}>
              <FormControl.Label>{t("description")}</FormControl.Label>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <VStack>
                      <Input
                        h="48"
                        multiline
                        textAlignVertical="top"
                        value={value}
                        onChangeText={onChange}
                      />
                      <HStack mt="1" justifyContent="space-between">
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon as={<Feather name="alert-circle" />} />
                          }
                        >
                          {errors.description && (
                            <Text>{errors.description.message}</Text>
                          )}
                        </FormControl.ErrorMessage>
                        <Text color={textColor}>
                          {value?.length ?? 0} / 100
                        </Text>
                      </HStack>
                    </VStack>
                  );
                }}
                rules={{
                  required: t("descriptionRequired"),
                  maxLength: {
                    value: 100,
                    message: t("descriptionMaxLength"),
                  },
                }}
              />
            </FormControl>
            <VStack>
              <FormControl.Label>{t("category")}</FormControl.Label>
              <HStack pt="1" space="2">
                {getCategories().map((category, index) => (
                  <Button
                    key={index}
                    colorScheme={index === categoryIndex ? "brand" : undefined}
                    variant={index === categoryIndex ? undefined : "unstyled"}
                    bg={index === categoryIndex ? undefined : bgColor}
                    _text={
                      index === categoryIndex ? undefined : { color: textColor }
                    }
                    onPress={() => setCategoryIndex(index)}
                  >
                    {t(category as Category)}
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
              postCommunity(data.name, data.description, data.category);
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
