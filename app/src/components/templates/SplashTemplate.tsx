import React, { memo } from "react";

import { Image } from "expo-image";
import { Box, Center, HStack, Heading, Spinner } from "native-base";

type SplashTemplateProps = { onLayout: () => Promise<void> };

const SplashTemplate = memo(({ onLayout }: SplashTemplateProps) => {
  return (
    <Center flex={1} bg="brand.600" onLayout={onLayout}>
      <HStack mt="-16" alignItems="center">
        <Image
          style={{ width: 52, height: 52 }}
          source={require("../../../assets/app/seedling.png")}
          contentFit="contain"
        />
        <Heading
          mt="3"
          color="white"
          fontWeight="semibold"
          letterSpacing="1"
          fontSize="4xl"
        >
          FarmLink
        </Heading>
      </HStack>
      <Box position="absolute" bottom="24">
        <Spinner color="white" />
      </Box>
    </Center>
  );
});

export default SplashTemplate;
