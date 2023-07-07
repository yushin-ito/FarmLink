import { Actionsheet, Icon } from "native-base";
import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type ImageActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  pickImageByCamera: () => void;
  pickImageByLibrary: () => void;
};

const ImageActionSheet = memo(
  ({
    isOpen,
    onClose,
    pickImageByCamera,
    pickImageByLibrary,
  }: ImageActionSheetProps) => {
    const { t } = useTranslation("setting");
    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            startIcon={<Icon as={<Feather />} name="camera" size="6" />}
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={() => {
              pickImageByCamera();
              onClose();
            }}
          >
            {t("camera")}
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={<Icon as={<Feather />} name="image" size="6" />}
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={() => {
              pickImageByLibrary();
              onClose();
            }}
          >
            {t("image")}
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={<Icon as={<Feather />} name="trash" size="6" />}
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={() => onClose()}
          >
            {t("delete")}
          </Actionsheet.Item>
          <Actionsheet.Item
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={onClose}
          >
            {t("cancel")}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    );
  }
);

export default ImageActionSheet;
