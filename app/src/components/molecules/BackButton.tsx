import { HStack, Icon, Text, Pressable, IPressableProps } from "native-base";
import { Feather } from "@expo/vector-icons";
import React, { memo } from "react";

type BackButtonProps = {
  text?: string;
};

const BackButton = memo(
  ({ text, ...props }: BackButtonProps & IPressableProps) => {
    return (
      <Pressable {...props}>
        <HStack alignItems="center">
          <Icon as={<Feather />} name="chevron-left" size="8" color="black" />
          <Text bold fontSize="xl">
            {text}
          </Text>
        </HStack>
      </Pressable>
    );
  }
);

export default BackButton;
