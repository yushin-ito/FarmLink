import React, { memo } from "react";
import {
  Box,
  Center,
  Divider,
  HStack,
  Pressable,
  Text,
  VStack,
} from "native-base";
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
    <VStack>
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
            <Center h="100%" px="5" roundedRight="md" bg="red.500">
              <Text color="white" bold fontSize="md">
                {t("delete")}
              </Text>
            </Center>
          </Pressable>
        )}
      >
        <Pressable
          onPress={onPress}
          _pressed={{ bg: "muted.200" }}
          rounded="md"
        >
          <HStack px="9" py="4">
            <Box w="25%">
              <Avatar
                size="md"
                fontSize="2xl"
                disabled
                text={item?.to.displayName?.charAt(0)}
                avatarUrl={item?.to.avatarUrl}
                updatedAt={item?.to.updatedAt}
                hue={item?.to.hue}
              />
            </Box>
            <VStack h="75%">
              <Text bold fontSize="md">
                {item.to?.displayName}
              </Text>
            </VStack>
          </HStack>
          <Divider w="80%" alignSelf="center" bg="muted.200" />
        </Pressable>
      </Swipeable>
    </VStack>
  );
});

export default TalkItem;
