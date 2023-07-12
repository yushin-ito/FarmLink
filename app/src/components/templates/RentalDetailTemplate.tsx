import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

import {
  Box,
  HStack,
  IconButton,
  Icon,
  FlatList,
  VStack,
  Heading,
  ScrollView,
} from "native-base";
import { Image } from "expo-image";
import { GetRentalResponse } from "../../hooks/rental/query";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";

type RentalDetailTemplateProps = {
  rental: GetRentalResponse | undefined;
  goBackNavigationHandler: () => void;
};

const RentalDetailTemplate = ({
  rental,
  goBackNavigationHandler,
}: RentalDetailTemplateProps) => {
  const { t } = useTranslation("map");
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather />} name="chevron-left" size="2xl" />}
          variant="unstyled"
        />
      </HStack>
      <VStack space="2">
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          data={rental?.imageUrls}
          renderItem={({ item }) => (
            <Box w={width} h="240" bg="muted.100">
              <Image
                source={{ uri: item }}
                style={{ flex: 1 }}
                contentFit="contain"
              />
            </Box>
          )}
          onMomentumScrollEnd={(event) => {
            const currentIndex = Math.floor(
              Math.floor(event.nativeEvent.contentOffset.x) /
                Math.floor(event.nativeEvent.layoutMeasurement.width)
            );
            setCurrentIndex(currentIndex);
          }}
        />
        <HStack w="100%" alignItems="center" justifyContent="center">
          {rental?.imageUrls?.map((_item, index) => (
            <Box
              key={index}
              mr="1"
              rounded="full"
              size={Number(index) === currentIndex ? "1.5" : "1"}
              bg={Number(index) === currentIndex ? "info.500" : "muted.400"}
            />
          ))}
        </HStack>
      </VStack>
      <ScrollView mt="4" px="5">
        <Heading fontSize="xl" numberOfLines={2} ellipsizeMode="tail">
          {rental?.rentalName}
        </Heading>
      </ScrollView>
    </Box>
  );
};

export default RentalDetailTemplate;
