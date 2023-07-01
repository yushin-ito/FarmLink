import React, { ReactNode, memo } from "react";
import {
  Pressable,
  IPressableProps,
  Text,
  Avatar as NativeBaseAvatar,
  Center,
  Spinner,
} from "native-base";
import { supabaseUrl } from "../../supabase";

type AvatarProps = {
  text?: string | null;
  avatarUrl?: string | null;
  updatedAt?: string | null;
  hue?: string | null;
  isLoading?: boolean;
  size?: string;
  fontSize?: string;
  badge?: ReactNode;
};

const Avatar = memo(
  ({
    text,
    avatarUrl,
    updatedAt,
    hue,
    isLoading,
    size = "10",
    fontSize = "md",
    badge,
    ...props
  }: AvatarProps & IPressableProps) => {
    if (isLoading) {
      return (
        <Center size={size}>
          <Spinner color="muted.400" />
        </Center>
      );
    }

    return (
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
              uri: avatarUrl?.match(supabaseUrl)
                ? avatarUrl + `?${updatedAt}`
                : avatarUrl ?? undefined,
            }}
            bg={avatarUrl ? "muted.300" : `hsl(${hue}, 60%, 60%)`}
          >
            <Text color="white" fontSize={fontSize}>
              {text}
            </Text>
            {badge}
          </NativeBaseAvatar>
        }
      </Pressable>
    );
  }
);

export default Avatar;
