import { Feather, Ionicons } from "@expo/vector-icons";
import {
  HStack,
  IconButton,
  Icon,
  Input,
  useDisclose,
  Box,
  Center,
  useColorModeValue,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import Stagger from "./Stagger";
import { memo } from "react";

type FormValues = {
  message: string | undefined;
};

type ChatBarProps = {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
  pickImageByCamera: () => Promise<void>;
  pickImageByLibrary: () => Promise<void>;
};

const ChatBar = memo(
  ({
    onSend,
    isLoading,
    pickImageByCamera,
    pickImageByLibrary,
  }: ChatBarProps) => {
    const { t } = useTranslation("chat");
    const bgColor = useColorModeValue("muted.300", "muted.700");
    const textColor = useColorModeValue("muted.600", "white");
    const iconColor = useColorModeValue("muted.600", "muted.100");

    const { control, handleSubmit, reset } = useForm<FormValues>();
    const { isOpen, onToggle } = useDisclose();
    const [showKeyboard, setShowKeyboard] = useState<boolean>(false);

    useEffect(() => {
      const showKeyboard = Keyboard.addListener("keyboardWillShow", () => {
        setShowKeyboard(true);
      });
      const hideKeyboard = Keyboard.addListener("keyboardWillHide", () => {
        setShowKeyboard(false);
      });

      return () => {
        showKeyboard.remove();
        hideKeyboard.remove();
      };
    }, []);

    return (
      <HStack
        w="100%"
        pt={Platform.OS === "ios" ? "1" : "3"}
        pb={showKeyboard || Platform.OS === "android" ? "1" : "9"}
        px="3"
        space="2"
        alignItems="center"
        justifyContent="space-between"
      >
        <Center>
          <Box position="absolute" bottom="12">
            <Stagger
              isOpen={isOpen}
              pickImageByCamera={async () => {
                await pickImageByCamera();
                onToggle();
              }}
              pickImageByLibrary={async () => {
                await pickImageByLibrary();
                onToggle();
              }}
            />
          </Box>
          <IconButton
            icon={
              <Icon
                as={<Feather />}
                name={isOpen ? "x" : "plus"}
                mb="1"
                size="6"
                color={iconColor}
              />
            }
            variant="unstyled"
            onPress={onToggle}
          />
        </Center>
        <Box w="70%" alignItems="center">
          <Controller
            name="message"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                keyboardAppearance={useColorModeValue("light", "dark")}
                variant="unstyled"
                textAlignVertical="top"
                multiline
                maxH="40"
                placeholder={t("enterMessage")}
                placeholderTextColor={textColor}
                fontSize="md"
                rounded="2xl"
                bg={bgColor}
                _focus={{ bg: bgColor }}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </Box>
        <IconButton
          onPress={handleSubmit(async (data) => {
            reset();
            data.message && (await onSend(data.message));
          })}
          icon={
            <Icon
              as={<Ionicons />}
              name="ios-send"
              size="6"
              color="brand.600"
              opacity={isLoading ? 0.5 : 1}
            />
          }
          variant="unstyled"
        />
      </HStack>
    );
  }
);

export default ChatBar;
