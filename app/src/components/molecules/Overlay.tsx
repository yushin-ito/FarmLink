import React, { memo } from "react";
import { Box, Center, PresenceTransition, Spinner } from "native-base";
import { useWindowDimensions } from "react-native";

type OverlayProps = {
  isOpen: boolean;
  showSpinner?: boolean;
};

const Overlay = memo(({ isOpen, showSpinner }: OverlayProps) => {
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
        <Center w={width} h={height} bg="black">
          {showSpinner && <Spinner color="muted.400" />}
        </Center>
      </PresenceTransition>
    </Box>
  );
});
export default Overlay;
