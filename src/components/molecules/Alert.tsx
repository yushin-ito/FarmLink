import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import {
  Alert as NativeBaseAlert,
  Icon,
  HStack,
  IconButton,
  Text,
} from "native-base";

type AlertProps = {
  onPressCloseButton: () => void;
  text: string;
  status: string;
};

const Alert = memo(({ onPressCloseButton, text, status }: AlertProps) => {
  return (
    <NativeBaseAlert status={status} rounded="md">
      <HStack space="2" alignItems="center">
        <NativeBaseAlert.Icon />
        <Text fontSize="md" color="black">{text}</Text>
        <IconButton
          onPress={onPressCloseButton}
          icon={<Icon as={<Feather name="x" />} size="3" />}
          variant="unstyled"
        />
      </HStack>
    </NativeBaseAlert>
  );
});

export default Alert;
