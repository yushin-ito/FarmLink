import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  VStack,
  Center,
  useColorModeValue,
} from "native-base";

import { SearchFarmsResponse } from "../../hooks/farm/mutate";
import { SearchRentalsResponse } from "../../hooks/rental/mutate";

type SearchMapItemProps = {
  item: SearchFarmsResponse[number] | SearchRentalsResponse[number];
  onPress: () => void;
};

const SearchMapItem = memo(({ item, onPress }: SearchMapItemProps) => {
  const pressedColor = useColorModeValue("muted.100", "muted.800");
  const imageColor = useColorModeValue("muted.200", "muted.600");
  const textColor = useColorModeValue("muted.600", "muted.300");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Pressable
      onPress={onPress}
      alignItems="center"
      _pressed={{ bg: pressedColor }}
    >
      <HStack
        w="100%"
        px="6"
        py="4"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack alignItems="center" space="3">
          <Center size="12" rounded="md" bg={imageColor} overflow="hidden">
            {item?.imageUrl ? (
              <Image
                style={{ width: 48, height: 48 }}
                source={{
                  uri: item.imageUrl,
                }}
              />
            ) : (
              <Icon as={<Feather />} name="image" size="lg" color={iconColor} />
            )}
          </Center>
          <VStack w="80%" space="1">
            <Text bold fontSize="md">
              {item.name}
            </Text>
            <Text
              color={textColor}
              fontSize="xs"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          </VStack>
        </HStack>
        <Icon
          as={<Feather />}
          name="chevron-right"
          size="md"
          color={iconColor}
        />
      </HStack>
      <Divider w="90%" bg="muted.200" />
    </Pressable>
  );
});

export default SearchMapItem;
