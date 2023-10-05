import React, { memo } from "react";
import {
  Pressable,
  IPressableProps,
  Text,
  Avatar as NativeBaseAvatar,
  Skeleton,
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
            source={{
              uri: uri.match(supabaseUrl) ? uri + `?=${updatedAt}` : uri,
            }}
            bg="muted.100"
          />
        ) : (
          <NativeBaseAvatar size={size} source={{ uri: undefined }} bg={color}>
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
