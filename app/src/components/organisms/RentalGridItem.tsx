import React, { memo } from "react";
import {
  Text,
  Center,
  Box,
  Icon,
  useColorModeValue,
  Pressable,
} from "native-base";
import { GetRentalsResponse } from "../../hooks/rental/query";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Rate } from "../../types";
import { Feather } from "@expo/vector-icons";

type RentalGridItemProps = {
  item: GetRentalsResponse[number];
  onPress: () => void;
};

const RentalGridItem = memo(({ item, onPress }: RentalGridItemProps) => {
  const { t } = useTranslation("map");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Pressable flex={1 / 3} mt="2" onPress={onPress}>
      <Center size="110" rounded="sm" bg="muted.200" overflow="hidden">
        {item.imageUrls?.length ? (
          <Image
            style={{ width: 110, height: 110 }}
            source={{
              uri: item.imageUrls[0],
            }}
          />
        ) : (
          <Icon as={<Feather />} name="image" size="lg" color={iconColor} />
        )}
        <Box
          pl="1"
          pr="2"
          roundedRight="xl"
          position="absolute"
          left="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.70)"
        >
          <Text bold color="white">
            {"￥" + item.fee + t(item.rate as Rate)}
          </Text>
        </Box>
      </Center>
    </Pressable>
  );
});

export default RentalGridItem;
