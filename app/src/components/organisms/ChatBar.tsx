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
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import React from "react-native";
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
    const { control, handleSubmit, reset } = useForm<FormValues>();
    const { isOpen, onToggle } = useDisclose();

    return (
      <HStack
        w="100%"
        pt="1"
        px="3"
        space="2"
        shadow="1"
        bg="white"
        alignItems="flex-end"
        justifyContent="space-between"
        safeAreaBottom
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
                color="muted.600"
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
                placeholderTextColor="muted.600"
                fontSize="md"
                rounded="2xl"
                bg="muted.300"
                _focus={{ bg: "muted.300" }}
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
