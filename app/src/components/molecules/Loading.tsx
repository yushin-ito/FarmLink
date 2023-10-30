import React, { memo, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type LoadingProps = {
  isLoading: boolean;
};

const Loading = memo(({ isLoading }: LoadingProps) => {
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
    if (isLoading) {
      animation.start();
    } else {
      rotate.setValue(0);
      animation.stop();
    }
  }, [isLoading]);

  return (
    <Animated.View
      style={{
        borderColor: "transparent",
        borderTopColor: "white",
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        borderWidth: 2,
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
  );
});
export default Loading;
