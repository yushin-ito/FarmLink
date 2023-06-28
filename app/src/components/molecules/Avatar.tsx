import React, { ReactNode, memo } from "react";
import {
  Pressable,
  IPressableProps,
  Text,
  Avatar as NativeBaseAvatar,
  Center,
  Spinner,
} from "native-base";
import { GetUserResponse } from "../../hooks/user/query";
import { supabaseUrl } from "../../supabase";

type AvatarProps = {
  user: GetUserResponse | null | undefined;
  isLoading?: boolean;
  size?: string;
  fontSize?: string;
  badge?: ReactNode;
};

const Avatar = memo(
  ({
    user,
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
              uri: user?.avatarUrl?.match(supabaseUrl)
                ? user.avatarUrl + `?${user?.updatedAt}`
                : user?.avatarUrl ?? undefined,
            }}
            bg={user?.avatarUrl ? "muted.300" : `hsl(${user?.hue}, 60%, 60%)`}
          >
            <Text color="white" fontSize={fontSize}>
              {user?.displayName?.charAt(0)}
            </Text>
            {badge}
          </NativeBaseAvatar>
        }
      </Pressable>
    );
  }
);

export default Avatar;
