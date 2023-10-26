import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import { Actionsheet, Icon, useColorModeValue } from "native-base";
import { useTranslation } from "react-i18next";

type ChatActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  deleteChat: () => Promise<void>;
};

const ChatActionSheet = memo(
  ({ isOpen, onClose, deleteChat }: ChatActionSheetProps) => {
    const { t } = useTranslation("chat");
    const pressedColor = useColorModeValue("muted.300", "muted.700");
    const iconColor = useColorModeValue("muted.500", "muted.300");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            startIcon={
              <Icon as={<Feather />} name="trash" size="6" color={iconColor} />
            }
            rounded="lg"
            _pressed={{ bg: pressedColor }}
            onPress={async () => {
              onClose();
              await deleteChat();
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

export default ChatActionSheet;
