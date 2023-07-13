import { Actionsheet, Icon } from "native-base";
import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

type ChatActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  deleteChat: () => Promise<void>;
};

const ChatActionSheet = memo(
  ({ isOpen, onClose, deleteChat }: ChatActionSheetProps) => {
    const { t } = useTranslation("chat");
    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            startIcon={<Icon as={<Feather />} name="trash" size="6" />}
            rounded="lg"
            _pressed={{ bg: "muted.300" }}
            onPress={async () => {
              onClose();
              await deleteChat();
            }}
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

export default ChatActionSheet;
