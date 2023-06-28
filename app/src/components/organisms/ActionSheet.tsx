import { Actionsheet as NativeBaseActionSheet, Icon } from "native-base";
import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type ActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  pickImageByCamera: () => void;
  pickImageByLibrary: () => void;
};

const ActionSheet = memo(
  ({
    isOpen,
    onClose,
    pickImageByCamera,
    pickImageByLibrary,
  }: ActionSheetProps) => {
    const { t } = useTranslation("setting");
    return (
      <NativeBaseActionSheet isOpen={isOpen} onClose={onClose} size="full">
        <NativeBaseActionSheet.Content>
          <NativeBaseActionSheet.Item
            startIcon={<Icon as={<Feather />} name="camera" size="6" />}
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={() => {
              pickImageByCamera();
              onClose();
            }}
          >
            {t("camera")}
          </NativeBaseActionSheet.Item>
          <NativeBaseActionSheet.Item
            startIcon={<Icon as={<Feather />} name="image" size="6" />}
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={() => {
              pickImageByLibrary();
              onClose();
            }}
          >
            {t("image")}
          </NativeBaseActionSheet.Item>
          <NativeBaseActionSheet.Item
            startIcon={<Icon as={<Feather />} name="trash" size="6" />}
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={() => onClose()}
          >
            {t("delete")}
          </NativeBaseActionSheet.Item>
          <NativeBaseActionSheet.Item
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={onClose}
          >
            {t("cancel")}
          </NativeBaseActionSheet.Item>
        </NativeBaseActionSheet.Content>
      </NativeBaseActionSheet>
    );
  }
);

export default ActionSheet;
