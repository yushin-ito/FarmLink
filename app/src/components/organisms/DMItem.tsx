import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { HStack, Icon, IconButton, Pressable, Text } from "native-base";
import { GetDMsResponse } from "../../hooks/dm/query";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

type DMItemProps = {
  item: GetDMsResponse[number];
  deleteDM: (DMId: number) => Promise<void>;
  dmChatNavigationHandler: (
    dmId: number,
    dmName: string | null
  ) => void;
};

const DMItem = memo(
  ({
    item,
    deleteDM,
    dmChatNavigationHandler,
  }: DMItemProps) => {
    const { t } = useTranslation("dm");

    return (
      <Pressable
        onPress={() =>
          dmChatNavigationHandler(item?.dmId, item?.dmName)
        }
      >
        <HStack
          mb="5"
          p="5"
          bg="white"
          shadow="1"
          rounded="lg"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text bold fontSize="md">
            {item.dmName}
          </Text>
          <IconButton
            onPress={() =>
              Alert.alert(t("deleteDM"), t("askDeleteDM"), [
                {
                  text: t("cancel"),
                  style: "cancel",
                },
                {
                  text: t("delete"),
                  onPress: async () => await deleteDM(item.dmId),
                  style: "destructive",
                },
              ])
            }
            _pressed={{
              opacity: 0.5,
            }}
            icon={<Icon as={<Feather />} name="trash" size="5" />}
            variant="ghost"
            colorScheme="muted"
          />
        </HStack>
      </Pressable>
    );
  }
);

export default DMItem;
