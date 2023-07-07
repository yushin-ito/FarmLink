import React, { memo } from "react";
import { Center, HStack, Pressable, Text } from "native-base";
import { GetTalksResponse } from "../../hooks/talk/query";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import Avatar from "../molecules/Avatar";
import { Swipeable } from "react-native-gesture-handler";

type TalkItemProps = {
  item: GetTalksResponse[number];
  deleteTalk: (talkId: number) => Promise<void>;
  onPress: () => void;
};

const TalkItem = memo(({ item, deleteTalk, onPress }: TalkItemProps) => {
  const { t } = useTranslation("talk");

  return (
    <Pressable
      onPress={onPress}
      _pressed={{ opacity: 0.8 }}
      mb="4"
      rounded="lg"
      bg="white"
      shadow="1"
    >
      <Swipeable
        renderRightActions={() => (
          <Pressable
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
          >
            <Center h="100%" px="5" roundedRight="lg" bg="red.500">
              <Text color="white" bold fontSize="md">
                {t("delete")}
              </Text>
            </Center>
          </Pressable>
        )}
      >
        <HStack px="5" py="3" alignItems="center" space="2">
          <Avatar
            disabled
            text={item?.to.displayName?.charAt(0)}
            avatarUrl={item?.to.avatarUrl}
            updatedAt={item?.to.updatedAt}
            hue={item?.to.hue}
            size="9"
          />
          <Text bold fontSize="md">
            {item.to?.displayName}
          </Text>
        </HStack>
      </Swipeable>
    </Pressable>
  );
});

export default TalkItem;
