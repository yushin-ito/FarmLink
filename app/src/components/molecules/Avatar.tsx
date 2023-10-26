import React, { memo } from "react";

import {
  Pressable,
  IPressableProps,
  Text,
  Avatar as NativeBaseAvatar,
  Skeleton,
  useColorModeValue,
} from "native-base";

import { supabaseUrl } from "../../supabase";

type AvatarProps = {
  text: string | undefined;
  uri: string | null | undefined;
  isLoading?: boolean;
  updatedAt: string | undefined;
  size?: string;
  fontSize?: string;
  color: string | null | undefined;
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
    const bgColor = useColorModeValue("muted.200", "muted.600");

    return isLoading ? (
      <Skeleton size={size} rounded="full" />
    ) : (
      <Pressable
        _pressed={{
          opacity: 0.5,
        }}
        {...props}
      >
        {uri ? (
          <NativeBaseAvatar
            size={size}
            bg={bgColor}
            source={{
              uri: uri.match(supabaseUrl) ? uri + `?=${updatedAt}` : uri,
            }}
          />
        ) : (
          <NativeBaseAvatar size={size} bg={color ?? bgColor}>
            <Text color="white" fontSize={fontSize}>
              {text}
            </Text>
          </NativeBaseAvatar>
        )}
      </Pressable>
    );
  }
);

export default Avatar;
