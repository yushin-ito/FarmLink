import { HStack, Icon, Text, Pressable, IPressableProps } from "native-base";
import { Feather } from "@expo/vector-icons";
import React, { memo } from "react";

const BackButton = memo(({ ...props }: IPressableProps) => {
  return (
    <Pressable {...props}>
      <HStack alignItems="center">
        <Icon as={<Feather name="chevron-left" />} size="8" color="muted.600" />
        <Text bold fontSize="xl" color="muted.600">
          戻る
        </Text>
      </HStack>
    </Pressable>
  );
});

export default BackButton;
