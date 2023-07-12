import React, { memo } from "react";
import {
  Pressable,
  IPressableProps,
  Text,
  Avatar as NativeBaseAvatar,
  Box,
} from "native-base";

type AvatarProps = {
  text: string | undefined;
  uri: string | null | undefined;
  isLoading?: boolean;
  size?: string;
  fontSize?: string;
  color: string | undefined;
};

const Avatar = memo(
  ({
    text,
    uri,
    color,
    isLoading,
    size = "10",
    fontSize = "md",
    ...props
  }: AvatarProps & IPressableProps) => {
    return isLoading ? (
      <Box size={size} bg="muted.300" />
    ) : (
      <Pressable
        _pressed={{
          opacity: 0.5,
        }}
        {...props}
      >
        {
          <NativeBaseAvatar
            size={size}
            source={{ uri: uri ?? undefined, cache: "reload" }}
            bg={uri ? "muted.300" : color}
          >
            <Text color="white" fontSize={fontSize}>
              {text}
            </Text>
          </NativeBaseAvatar>
        }
      </Pressable>
    );
  }
);

export default Avatar;
