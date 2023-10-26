import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  Center,
  useColorModeValue,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";

import { SearchUsersResponse } from "../../hooks/user/mutate";
import Avatar from "../molecules/Avatar";


type SearchUserItemProps = {
  item: SearchUsersResponse[number];
  onPress: () => void;
  selected: boolean;
};

const SearchUserItem = memo(
  ({ item, onPress, selected }: SearchUserItemProps) => {
    const { t } = useTranslation("setting");
    const pressedColor = useColorModeValue("muted.100", "muted.800");
    const textColor = useColorModeValue("muted.600", "muted.300");

    return (
      <Pressable
        onPress={onPress}
        alignItems="center"
        _pressed={{ bg: pressedColor }}
      >
        <HStack
          w="100%"
          px="6"
          py="5"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center" space="3">
            <Avatar
              isDisabled
              text={item.name?.charAt(0)}
              uri={item.avatarUrl}
              color={item.color}
              size="9"
              updatedAt={item.updatedAt}
            />
            <VStack w="80%" space="1">
              <Text bold fontSize="md">
                {item?.name}
              </Text>
              <Text
                color={textColor}
                fontSize="xs"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {!item.profile ? t("noProfile") : item.profile}
              </Text>
            </VStack>
          </HStack>
          <Center
            size="5"
            rounded="full"
            bg={selected ? "success.500" : "muted.300"}
          >
            {selected && (
              <Icon as={<Feather />} name="check" size="xs" color="white" />
            )}
          </Center>
        </HStack>
        <Divider w="90%" bg="muted.200" />
      </Pressable>
    );
  }
);

export default SearchUserItem;
