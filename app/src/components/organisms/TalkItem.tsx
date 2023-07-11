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
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { getTimeDistance } from "../../functions";

type TalkItemProps = {
  item: GetTalksResponse[number];
  locale: "en" | "ja" | null;
  deleteTalk: (talkId: number) => Promise<void>;
  onPress: () => void;
};

const TalkItem = memo(
  ({ item, locale, deleteTalk, onPress }: TalkItemProps) => {
    const { t } = useTranslation("talk");
    return (
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
            <Center h="100%" px="8" bg="red.500">
              <Text color="white" bold fontSize="md">
                {t("delete")}
              </Text>
            </Center>
          </Pressable>
        )}
      >
        <TouchableHighlight onPress={onPress} underlayColor="#e5e5e5">
          <VStack>
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
              <VStack w="75%" space="1">
                <HStack alignItems="center" justifyContent="space-between">
                  <Text bold fontSize="md">
                    {item.to?.displayName}
                  </Text>
                  <Text fontSize="sm">
                    {getTimeDistance(item.updatedAt, locale)}
                  </Text>
                </HStack>
                <Text
                  color="muted.600"
                  fontSize="xs"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.lastMessage}
                </Text>
              </VStack>
            </HStack>
            <Divider w="80%" alignSelf="center" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default TalkItem;
