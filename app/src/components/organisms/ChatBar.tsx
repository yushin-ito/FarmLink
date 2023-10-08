import { Feather, Ionicons } from "@expo/vector-icons";
import {
  HStack,
  IconButton,
  Icon,
  Input,
  useDisclose,
  Box,
  Center,
  Spinner,
  useColorModeValue,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
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
        pt="1"
        px="3"
        space="2"
        alignItems="flex-end"
        justifyContent="space-between"
        pb={showKeyboard ? "1" : "9"}
      >
        <Center>
          <Box position="absolute" bottom="12">
            <Stagger
              isOpen={isOpen}
              pickImageByCamera={pickImageByCamera}
              pickImageByLibrary={pickImageByLibrary}
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
        <Box w="70%">
          <Controller
            name="message"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                mb="2"
                variant="unstyled"
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
            if (data.message) {
              await onSend(data.message);
            }
          })}
          icon={
            <Icon
              as={isLoading ? <Spinner color="muted.200" /> : <Ionicons />}
              mb="1"
              name="ios-send"
              size="6"
              color="brand.600"
            />
          }
          variant="unstyled"
          _pressed={{
            opacity: 0.5,
          }}
        />
      </HStack>
    );
  }
);

export default ChatBar;
