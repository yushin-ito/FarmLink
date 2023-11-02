import React, { memo } from "react";

import { Image } from "expo-image";
import { Center, HStack, Heading } from "native-base";

type SplashTemplateProps = { onLayout: () => Promise<void> };

const SplashTemplate = memo(({ onLayout }: SplashTemplateProps) => {
  return (
    <Center flex={1} bg="brand.600" onLayout={onLayout}>
      <HStack alignItems="center">
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
    </Center>
  );
});

export default SplashTemplate;
