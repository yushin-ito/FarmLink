import React, { memo } from "react";
import { Center, Modal, Spinner } from "native-base";
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
    <Modal isOpen={isOpen}>
      <Center w={width} h={height} bg="rgba(0, 0, 0, 0.60)">
        {showSpinner && <Spinner color="white" />}
      </Center>
    </Modal>
  );
});
export default Overlay;
