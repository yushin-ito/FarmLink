import React, { memo } from "react";
import { Center, Modal, Spinner } from "native-base";
import { useWindowDimensions } from "react-native";

type OverlayProps = {
  isOpen: boolean;
  opacity?: string;
  showSpinner?: boolean;
};

const Overlay = memo(
  ({ isOpen, opacity = "0.6", showSpinner }: OverlayProps) => {
    const { width, height } = useWindowDimensions();

    if (!isOpen) {
      return null;
    }

    return (
      <Modal isOpen={isOpen}>
        <Center w={width} h={height} bg={`rgba(0, 0, 0, ${opacity})`}>
          {showSpinner && <Spinner color="muted.200" />}
        </Center>
      </Modal>
    );
  }
);
export default Overlay;
