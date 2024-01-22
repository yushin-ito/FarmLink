import React, { memo } from "react";

import { Center, Modal, Spinner } from "native-base";

type OverlayProps = {
  isOpen: boolean;
};

const Overlay = memo(({ isOpen }: OverlayProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      flex={1}
      _overlay={{ style: { backgroundColor: "rgba(0, 0, 0, 0.4)" } }}
    >
      <Center>
        <Spinner color="muted.200" />
      </Center>
    </Modal>
  );
});
export default Overlay;
