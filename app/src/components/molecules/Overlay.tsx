import React, { memo } from "react";

import { Center, Modal } from "native-base";

import Loading from "./Loading";

type OverlayProps = {
  isOpen: boolean;
  loadingEnabled?: boolean;
};

const Overlay = memo(({ isOpen, loadingEnabled }: OverlayProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      flex={1}
      _overlay={{ style: { backgroundColor: "rgba(0, 0, 0, 0.4)" } }}
    >
      <Center>{loadingEnabled && <Loading isLoading={isOpen} />}</Center>
    </Modal>
  );
});
export default Overlay;
