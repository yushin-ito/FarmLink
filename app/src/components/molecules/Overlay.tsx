import React, { memo } from "react";
import { Box, PresenceTransition } from "native-base";
import { useWindowDimensions } from "react-native";

type OverlayProps = {
  isOpen: boolean;
};

const Overlay = memo(({ isOpen }: OverlayProps) => {
  const { width, height } = useWindowDimensions();

  if (!isOpen) {
    return null;
  }

  return (
    <Box position="absolute" zIndex="1">
      <PresenceTransition
        visible={isOpen}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.3,
          transition: {
            duration: 100,
          },
        }}
      >
        <Box w={width} h={height} bg="black" />
      </PresenceTransition>
    </Box>
  );
});
export default Overlay;
