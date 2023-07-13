import React, { memo } from "react";
import {
  Pressable,
  IPressableProps,
  Text,
  Avatar as NativeBaseAvatar,
  Box,
} from "native-base";
import { supabaseUrl } from "../../supabase";

type AvatarProps = {
  text: string | undefined;
  uri: string | null | undefined;
  isLoading?: boolean;
  updatedAt: string | undefined;
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
    updatedAt,
    size = "10",
    fontSize = "md",
    ...props
  }: AvatarProps & IPressableProps) => {
    return isLoading ? (
      <Box size={size} bg="muted.300" rounded="full" />
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
            source={{
              uri: uri?.match(supabaseUrl)
                ? uri + `?${updatedAt}`
                : uri ?? undefined,
            }}
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
