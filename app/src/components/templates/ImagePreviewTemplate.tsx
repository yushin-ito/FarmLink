import {
  Box,
  HStack,
  Heading,
  Icon,
  IconButton,
  PresenceTransition,
  Pressable,
} from "native-base";
import React, { useState, useRef } from "react";
import { Animated, useWindowDimensions } from "react-native";
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";

type ImagePreviewTemplateProps = {
  title: string;
  imageUrl: string;
  goBackNavigationHandler: () => void;
};

const ImagePreviewTemplate = ({
  imageUrl,
  goBackNavigationHandler,
}: ImagePreviewTemplateProps) => {
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState<boolean>(true);
  const [enabled, setEnabled] = useState<boolean>(false);
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const { height } = useWindowDimensions();

  const pinchRef = useRef<PinchGestureHandler>();
  const panRef = useRef<PanGestureHandler>();

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: { scale },
      },
    ],
    { useNativeDriver: true }
  );

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handlePinchStateChange = ({
    nativeEvent,
  }: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) => {
    if (nativeEvent.state === State.ACTIVE) {
      setEnabled(true);
    }

    if (nativeEvent.state === State.END) {
      if (nativeEvent.scale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        setEnabled(false);
      }
    }
  };

  return (
    <Box flex={1} bg="black">
      <StatusBar style="light" />
      <Pressable onPress={() => setVisible(!visible)}>
        <PanGestureHandler
          onGestureEvent={onPanEvent}
          ref={panRef}
          simultaneousHandlers={[pinchRef]}
          enabled={enabled}
          failOffsetX={[-1000, 1000]}
          shouldCancelWhenOutside
        >
          <Animated.View>
            <PinchGestureHandler
              ref={pinchRef}
              onGestureEvent={onPinchEvent}
              simultaneousHandlers={[panRef]}
              onHandlerStateChange={handlePinchStateChange}
            >
              <Animated.Image
                source={{
                  uri: imageUrl,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [{ scale }, { translateX }, { translateY }],
                }}
                resizeMode="contain"
              />
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Pressable>
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
          bottom={height - 96}
          bg="rgba(0, 0, 0, 0.60)"
        >
          <IconButton
            onPress={goBackNavigationHandler}
            icon={<Icon as={<Feather name="x" />} size="lg" color="white" />}
            variant="unstyled"
          />
          <Heading color="white">{t("preview")}</Heading>
          <IconButton
            icon={
              <Icon as={<Feather name="share" />} size="lg" color="white" />
            }
            variant="unstyled"
          />
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
              <Icon as={<Feather name="trash" />} size="lg" color="white" />
            }
            variant="unstyled"
          />
          <IconButton
            icon={
              <Icon as={<Feather name="download" />} size="lg" color="white" />
            }
            variant="unstyled"
          />
        </HStack>
      </PresenceTransition>
    </Box>
  );
};

export default ImagePreviewTemplate;
