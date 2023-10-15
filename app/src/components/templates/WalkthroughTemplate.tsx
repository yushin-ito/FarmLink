import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Box,
  Button,
  FlatList,
  HStack,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "native-base";
import { Image } from "expo-image";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";

type WalkthroughTemplateProps = {
  verified: boolean;
  farmListNavigationHandler: () => void;
};

const WalkthroughTemplate = ({
  verified,
  farmListNavigationHandler,
}: WalkthroughTemplateProps) => {
  const { t } = useTranslation("common");
  const bgColor = useColorModeValue("white", "muted.900");
  const textColor = useColorModeValue("muted.600", "muted.300");

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { width } = useWindowDimensions();

  const walkthrough = [
    {
      title: t("rental"),
      text: t("rentalText"),
      path: require("../../../assets/screens/rental.png"),
    },
    {
      title: t("community"),
      text: t("communityText"),
      path: require("../../../assets/screens/community.png"),
    },

    {
      title: t("farm"),
      text: t("farmText"),
      path: require("../../../assets/screens/farm.png"),
    },
    {
      title: t("monitor"),
      text: t("monitorText"),
      path: require("../../../assets/screens/monitor.png"),
    },
  ];

  return (
    <Box flex={1} safeAreaTop>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        data={walkthrough}
        renderItem={({ item, index }) => (
          <VStack w={width} alignItems="center">
            <VStack mt="12" mb="10" space="2">
              <Heading fontSize="28" textAlign="center">
                {item.title}
              </Heading>
              <Text bold fontSize="lg" textAlign="center" color={textColor}>
                {item.text}
              </Text>
            </VStack>
            <Image
              source={item.path}
              style={{ width: 250, height: 450 }}
              contentFit="contain"
            />
            {index === 3 && (
              <VStack mt="10" w="70%" h="32" bg={bgColor} zIndex="1" space="2">
                <Button
                  size="lg"
                  rounded="xl"
                  colorScheme="brand"
                  isDisabled={!verified}
                  onPress={farmListNavigationHandler}
                >
                  <Text bold color="white" fontSize="md">
                    {t("start")}
                  </Text>
                </Button>
                {!verified && (
                  <HStack alignItems="center" justifyContent="center" space="1">
                    <Icon
                      as={<Feather />}
                      name="alert-circle"
                      color="error.600"
                    />
                    <Text bold fontSize="xs" color="error.600">
                      {t("alertVerify")}
                    </Text>
                  </HStack>
                )}
              </VStack>
            )}
          </VStack>
        )}
        onMomentumScrollEnd={(event) => {
          const currentIndex = Math.floor(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width
          );
          setCurrentIndex(currentIndex);
        }}
      />
      <HStack
        w="100%"
        position="absolute"
        bottom="16"
        alignItems="center"
        justifyContent="center"
        space="2"
        zIndex="-1"
      >
        {walkthrough.map((_item, index) => (
          <Box
            key={index}
            rounded="full"
            size={Number(index) === currentIndex ? "2" : "1.5"}
            bg={Number(index) === currentIndex ? "info.500" : "muted.400"}
          />
        ))}
      </HStack>
    </Box>
  );
};

export default WalkthroughTemplate;
