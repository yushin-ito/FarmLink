import { Actionsheet, Icon, useColorModeValue } from "native-base";
import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type ImageActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  pickImageByCamera: () => void;
  pickImageByLibrary: () => void;
};

const ImageActionSheet = memo(
  ({
    isOpen,
    onClose,
    onDelete,
    pickImageByCamera,
    pickImageByLibrary,
  }: ImageActionSheetProps) => {
    const { t } = useTranslation("setting");
    const pressedColor = useColorModeValue("muted.300", "muted.700");
    const iconColor = useColorModeValue("muted.500", "muted.300");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            startIcon={
              <Icon as={<Feather />} name="camera" size="6" color={iconColor} />
            }
            rounded="lg"
            _pressed={{ bg: pressedColor }}
            onPress={() => {
              pickImageByCamera();
              onClose();
            }}
          >
            {t("camera")}
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={
              <Icon as={<Feather />} name="image" size="6" color={iconColor} />
            }
            rounded="lg"
            _pressed={{ bg: pressedColor }}
            onPress={() => {
              pickImageByLibrary();
              onClose();
            }}
          >
            {t("image")}
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={
              <Icon as={<Feather />} name="trash" size="6" color={iconColor} />
            }
            rounded="lg"
            _pressed={{ bg: pressedColor }}
            onPress={() => {
              onDelete();
              onClose();
            }}
          >
            {t("delete")}
          </Actionsheet.Item>
          <Actionsheet.Item
            rounded="lg"
            _pressed={{ bg: pressedColor }}
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
