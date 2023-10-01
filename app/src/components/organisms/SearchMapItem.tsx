import React, { memo } from "react";
import { SearchFarmsResponse } from "../../hooks/farm/mutate";
import {
  Divider,
  HStack,
  Pressable,
  Text,
  Icon,
  VStack,
  Center,
} from "native-base";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { SearchRentalsResponse } from "../../hooks/rental/mutate";

type SearchMapItemProps = {
  item: SearchFarmsResponse[number] | SearchRentalsResponse[number];
  onPress: () => void;
};

const SearchMapItem = memo(({ item, onPress }: SearchMapItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      alignItems="center"
      _pressed={{ bg: "muted.200" }}
    >
      <HStack
        w="100%"
        px="6"
        py="5"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack alignItems="center" space="3">
          <Center size="12" rounded="md" bg="muted.200" overflow="hidden">
            {item?.imageUrl ? (
              <Image
                style={{ width: 48, height: 48 }}
                source={{
                  uri: item.imageUrl,
                }}
              />
            ) : (
              <Icon as={<Feather />} name="image" size="lg" color="muted.600" />
            )}
          </Center>
          <VStack w="80%" space="1">
            <Text bold fontSize="md">
              {item.name}
            </Text>
            <Text
              color="muted.600"
              fontSize="xs"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          </VStack>
        </HStack>
        <Icon as={<Feather />} name="chevron-right" size="md" />
      </HStack>
      <Divider w="90%" bg="muted.200" />
    </Pressable>
  );
});

export default SearchMapItem;
