import React, { memo, useEffect, useRef } from "react";
import { Center, Modal } from "native-base";
import { Animated, Easing, useWindowDimensions } from "react-native";

type OverlayProps = {
  isOpen: boolean;
  loadingEnabled?: boolean;
};

const Overlay = memo(({ isOpen, loadingEnabled }: OverlayProps) => {
  const { width, height } = useWindowDimensions();
  const rotate = useRef(new Animated.Value(0)).current;
  const animation = useRef(
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 360,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
  ).current;

  useEffect(() => {
    if (isOpen) {
      animation.start();
    } else {
      rotate.setValue(0);
      animation.stop();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen}>
      <Center w={width} h={height} bg={`rgba(0, 0, 0, 0.6)`}>
        {loadingEnabled && (
          <Animated.View
            style={{
              borderColor: "transparent",
              borderTopColor: "white",
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 3,
              transform: [
                {
                  rotateZ: rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          />
        )}
      </Center>
    </Modal>
  );
});
export default Overlay;
