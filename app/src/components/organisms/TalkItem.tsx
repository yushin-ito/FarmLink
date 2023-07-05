import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { HStack, Icon, IconButton, Pressable, Text } from "native-base";
import { GetTalksResponse } from "../../hooks/talk/query";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

type TalkItemProps = {
  item: GetTalksResponse[number];
  deleteTalk: (talkId: number) => Promise<void>;
  talkChatNavigationHandler: (
    talkId: number,
    talkName: string | null | undefined
  ) => void;
};

const TalkItem = memo(
  ({ item, deleteTalk, talkChatNavigationHandler }: TalkItemProps) => {
    const { t } = useTranslation("talk");

    return (
      <Pressable
        onPress={() =>
          talkChatNavigationHandler(item?.talkId, item?.from?.displayName)
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
            {item.to?.displayName}
          </Text>
          <IconButton
            onPress={() =>
              Alert.alert(t("deleteTalk"), t("askDeleteTalk"), [
                {
                  text: t("cancel"),
                  style: "cancel",
                },
                {
                  text: t("delete"),
                  onPress: async () => await deleteTalk(item.talkId),
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

export default TalkItem;
