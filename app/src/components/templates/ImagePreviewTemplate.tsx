/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, useWindowDimensions } from "react-native";

import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Box,
  Center,
  HStack,
  Heading,
  Icon,
  IconButton,
  PresenceTransition,
  Spinner,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from "react-native-reanimated";

type ImagePreviewTemplateProps = {
  title: string;
  imageUrl: string;
  shareImage: () => Promise<void>;
  saveImage: () => Promise<void>;
  deleteImage?: () => Promise<void>;
  isLoading: boolean;
  goBackNavigationHandler: () => void;
};

const ImagePreviewTemplate = ({
  title,
  imageUrl,
  saveImage,
  shareImage,
  deleteImage,
  isLoading,
  goBackNavigationHandler,
}: ImagePreviewTemplateProps) => {
  const { t } = useTranslation("chat");

  const dimensions = useWindowDimensions();

  const [visible, setVisible] = useState<boolean>(true);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const scale = useSharedValue(1);
  const saveScale = useSharedValue(1);

  const translateY = useSharedValue(0);
  const saveTranslateY = useSharedValue(0);

  const translateX = useSharedValue(0);
  const saveTranslateX = useSharedValue(0);

  useEffect(() => {
    Image.getSize(imageUrl, (width, height) => {
      setWidth(width);
      setHeight(height);
    });
  }, [imageUrl]);

  const resize = useMemo(() => {
    if (!width) {
      return { width: 0, height: 0 };
    }

    if (!height) {
      return { width: 0, height: 0 };
    }

    if (width === height) {
      return {
        width: Math.min(dimensions.width, dimensions.height),
        height: Math.min(dimensions.width, dimensions.height),
      };
    } else if (width > height) {
      return {
        width: dimensions.width,
        height: (dimensions.width * height) / width,
      };
    } else {
      if ((height * dimensions.height) / width > dimensions.width) {
        return {
          width: dimensions.width,
          height: (dimensions.width * height) / width,
        };
      }

      return {
        width: (width * dimensions.height) / height,
        height: dimensions.height,
      };
    }
  }, [width, height, dimensions.width, dimensions.height]);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      saveScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = saveScale.value * event.scale;
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      saveTranslateX.value = translateX.value;
      saveTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      runOnJS(setVisible)(false);
      if (scale.value < 1) {
        return;
      }

      const size = {
        width: resize.width * scale.value,
        height: resize.height * scale.value,
      };

      const maxTranslateX =
        size.width <= dimensions.width
          ? 0
          : (size.width - dimensions.width) / 2;
      const minTranslateX =
        size.width <= dimensions.width
          ? 0
          : -(size.width - dimensions.width) / 2;

      const newTranslateX = saveTranslateX.value + event.translationX;

      if (newTranslateX > maxTranslateX) {
        translateX.value = maxTranslateX;
      } else if (newTranslateX < minTranslateX) {
        translateX.value = minTranslateX;
      } else {
        translateX.value = newTranslateX;
      }

      if (scale.value > 1) {
        const maxTranslateY =
          size.height <= dimensions.height
            ? 0
            : (size.height - dimensions.height) / 2;
        const minTranslateY =
          size.height <= dimensions.height
            ? 0
            : -(size.height - dimensions.height) / 2;

        const newTranslateY = saveTranslateY.value + event.translationY;

        if (newTranslateY > maxTranslateY) {
          translateY.value = maxTranslateY;
        } else if (newTranslateY < minTranslateY) {
          translateY.value = minTranslateY;
        } else {
          translateY.value = newTranslateY;
        }
      } else {
        translateY.value = saveTranslateY.value + event.translationY;
      }
    })
    .onEnd((event) => {
      if (scale.value === 1) {
        if (event.velocityY > 3000 || event.translationY > 100) {
          runOnJS(goBackNavigationHandler)();
          return;
        }

        translateY.value = withTiming(0);
        translateX.value = withTiming(0);
      } else if (scale.value < 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        runOnJS(setVisible)(true);
      } else if (scale.value > 3) {
        scale.value = withTiming(3);
      } else {
        const size = {
          width: resize.width * scale.value,
          height: resize.height * scale.value,
        };

        const maxTranslateX =
          size.width <= dimensions.width
            ? 0
            : (size.width - dimensions.width) / 2;
        const minTranslateX =
          size.width <= dimensions.width
            ? 0
            : -(size.width - dimensions.width) / 2;

        translateX.value = withDecay({
          velocity: event.velocityX,
          clamp: [minTranslateX, maxTranslateX],
        });

        const maxTranslateY =
          size.height <= dimensions.height
            ? 0
            : (size.height - dimensions.height) / 2;
        const minTranslateY =
          size.height <= dimensions.height
            ? 0
            : -(size.height - dimensions.height) / 2;

        translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [minTranslateY, maxTranslateY],
        });
      }
    });

  const singleTap = Gesture.Tap().onEnd(() => {
    runOnJS(setVisible)(!visible);
  });

  const doubleTap = Gesture.Tap()
    .onStart((event) => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        scale.value = withTiming(3);

        const size = {
          width: resize.width * 3,
          height: resize.height * 3,
        };

        const maxTranslateX = (size.width - dimensions.width) / 2;
        const minTranslateX = -(size.width - dimensions.width) / 2;

        const newTranslateX = (resize.width / 2 - event.x) * 3;

        if (newTranslateX > maxTranslateX) {
          translateX.value = withTiming(maxTranslateX);
        } else if (newTranslateX < minTranslateX) {
          translateX.value = withTiming(minTranslateX);
        } else {
          translateX.value = withTiming(newTranslateX);
        }

        const maxTranslateY =
          size.height <= dimensions.height
            ? 0
            : (size.height - dimensions.height) / 2;
        const minTranslateY =
          size.height <= dimensions.height
            ? 0
            : -(size.height - dimensions.height) / 2;

        const newTranslateY = (resize.height / 2 - event.y) * 3;

        if (newTranslateY > maxTranslateY) {
          withTiming(maxTranslateY);
        } else if (newTranslateY < minTranslateY) {
          withTiming(minTranslateY);
        } else {
          withTiming(newTranslateY);
        }
      }
    })
    .numberOfTaps(2);

  // @ts-ignore
  const imageContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  // @ts-ignore
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  const gesture = Gesture.Exclusive(
    Gesture.Simultaneous(pinchGesture, panGesture),
    doubleTap,
    singleTap
  );

  return (
    <Box flex={1} bg="black">
      <StatusBar style="light" />
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View style={imageContainerAnimatedStyle}>
            <Animated.Image
              style={[
                // @ts-ignore
                imageAnimatedStyle,
                {
                  width: resize.width,
                  height: resize.height,
                },
              ]}
              source={{
                uri: imageUrl,
              }}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <PresenceTransition
        visible={visible}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 200,
          },
        }}
      >
        <HStack
          w="100%"
          h="24"
          px="4"
          pt="9"
          alignItems="center"
          justifyContent="space-between"
          position="absolute"
          bottom={dimensions.height - 96}
          bg="rgba(0, 0, 0, 0.60)"
        >
          <IconButton
            onPress={goBackNavigationHandler}
            icon={<Icon as={<Feather name="chevron-left" />} size="lg" color="white" />}
            variant="unstyled"
          />
          <Heading fontSize="xl" color="white">
            {title}
          </Heading>
          {deleteImage ? (
            <IconButton
              icon={
                <Icon as={<Feather name="trash" />} size="md" color="white" />
              }
              onPress={() =>
                Alert.alert(t("deleteChat"), t("askDeleteChat"), [
                  {
                    text: t("cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("delete"),
                    onPress: () => deleteImage(),
                    style: "destructive",
                  },
                ])
              }
              variant="unstyled"
            />
          ) : (
            <Box size="9" />
          )}
        </HStack>
        <HStack
          w="100%"
          h="20"
          px="9"
          pb="6"
          alignItems="center"
          justifyContent="space-between"
          position="absolute"
          bottom="0"
          bg="rgba(0, 0, 0, 0.60)"
        >
          <IconButton
            icon={
              <Icon as={<Feather name="share" />} size="lg" color="white" />
            }
            variant="unstyled"
            onPress={shareImage}
          />
          <IconButton
            icon={
              <Icon as={<Feather name="download" />} size="lg" color="white" />
            }
            variant="unstyled"
            onPress={saveImage}
          />
        </HStack>
      </PresenceTransition>
      {isLoading && (
        <Center w="100%" h="100%" position="absolute" bg="white" opacity="0.3">
          <Spinner color="muted.600" />
        </Center>
      )}
    </Box>
  );
};

export default ImagePreviewTemplate;
