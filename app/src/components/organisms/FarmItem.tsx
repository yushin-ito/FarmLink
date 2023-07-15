import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Box,
  Center,
  Divider,
  HStack,
  Pressable,
  Text,
  VStack,
  Icon,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { GetUserFarmsResponse } from "../../hooks/farm/query";
import { Image } from "expo-image";

type TalkItemProps = {
  item: GetUserFarmsResponse[number];
  onPress: () => void;
  onPressRight: () => void;
};

const TalkItem = memo(({ item, onPressRight, onPress }: TalkItemProps) => {
  const { t } = useTranslation("farm");
  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable
          onPress={onPressRight}
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
      <TouchableHighlight
        onPress={onPress}
        style={{ backgroundColor: "white" }}
        underlayColor="#f5f5f5"
      >
        <VStack>
          <HStack h="20" px="9" py="3">
            <Box w="20%">
              <Center size="12" rounded="md" bg="muted.200">
                {item.imageUrl ? (
                  <Image
                    style={{ width: 48, height: 48 }}
                    source={{ uri: item.imageUrl }}
                    contentFit="contain"
                  />
                ) : (
                  <Icon
                    as={<Feather />}
                    name="image"
                    size="lg"
                    color="muted.600"
                  />
                )}
              </Center>
            </Box>
            <VStack w="80%" space="1">
              <Text bold fontSize="md">
                {item.name}
              </Text>
            </VStack>
          </HStack>
          <Divider w="80%" alignSelf="center" bg="muted.200" />
        </VStack>
      </TouchableHighlight>
    </Swipeable>
  );
});

export default TalkItem;
