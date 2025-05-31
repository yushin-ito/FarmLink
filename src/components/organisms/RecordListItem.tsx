import React, { memo, useRef } from "react";

import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import {
  Center,
  Divider,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  useColorModeValue,
} from "native-base";
import { useTranslation } from "react-i18next";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";

import { GetRecordsResponse } from "../../hooks/record/query";

type RecordListItemProps = {
  item: GetRecordsResponse[number];
  onPress: () => void;
  onPressLeft: () => void;
  onPressRight: () => void;
};

const RecordListItem = memo(
  ({ item, onPress, onPressLeft, onPressRight }: RecordListItemProps) => {
    const { t } = useTranslation("farm");

    const bgColor = useColorModeValue("white", "#171717");
    const pressedColor = useColorModeValue("#f5f5f5", "#262626");
    const textColor = useColorModeValue("muted.600", "muted.300");
    const iconColor = useColorModeValue("muted.500", "muted.300");

    const swipeableRef = useRef<Swipeable>(null);

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={() => (
          <HStack>
            <Pressable
              onPress={() => {
                onPressLeft();
                swipeableRef.current?.close();
              }}
              _pressed={{
                opacity: 0.5,
              }}
            >
              <Center h="100%" w="24" bg="blue.500">
                <Text color="white" bold fontSize="md">
                  {t("edit")}
                </Text>
              </Center>
            </Pressable>
            <Pressable
              onPress={onPressRight}
              _pressed={{
                opacity: 0.5,
              }}
            >
              <Center h="100%" w="24" bg="red.500">
                <Text color="white" bold fontSize="md">
                  {t("delete")}
                </Text>
              </Center>
            </Pressable>
          </HStack>
        )}
      >
        <TouchableHighlight
          onPress={onPress}
          style={{ backgroundColor: bgColor }}
          underlayColor={pressedColor}
        >
          <VStack>
            <HStack h="20" px="9" py="4">
              <VStack w="20%">
                {(() => {
                  switch (item.weather) {
                    case "sunny":
                      return (
                        <Center size="12" rounded="full" bg="orange.200">
                          <Icon
                            as={<Feather />}
                            name="sun"
                            size="5"
                            color="orange.400"
                          />
                        </Center>
                      );
                    case "cloudy":
                      return (
                        <Center size="12" rounded="full" bg="muted.200">
                          <Icon
                            as={<Feather />}
                            name="cloud"
                            size="5"
                            color="muted.400"
                          />
                        </Center>
                      );
                    case "rainy":
                      return (
                        <Center size="12" rounded="full" bg="lightBlue.200">
                          <Icon
                            as={<Feather />}
                            name="cloud-rain"
                            size="5"
                            color="lightBlue.400"
                          />
                        </Center>
                      );
                    case "snowy":
                      return (
                        <Center size="12" rounded="full" bg="indigo.200">
                          <Icon
                            as={<Feather />}
                            name="cloud-snow"
                            size="5"
                            color="indigo.400"
                          />
                        </Center>
                      );
                  }
                })()}
              </VStack>
              <VStack w="80%" pr="4" space="2">
                <Text color={textColor} bold fontSize="sm">
                  {item.work}
                </Text>
                <HStack space="4">
                  <HStack alignItems="center" space="0.5">
                    <Icon
                      as={<Feather />}
                      name="corner-left-down"
                      size="3"
                      color={iconColor}
                    />
                    <Text color={iconColor} fontSize="xs">
                      {item.pesticide}
                    </Text>
                  </HStack>
                  <HStack alignItems="center" space="0.5">
                    <Icon
                      as={<Feather />}
                      name="clock"
                      size="3"
                      color={iconColor}
                    />
                    <Text color={iconColor} fontSize="xs">
                      {format(new Date(item.createdAt), "HH:mm")}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </HStack>
            <Divider w="80%" alignSelf="center" bg="muted.200" />
          </VStack>
        </TouchableHighlight>
      </Swipeable>
    );
  }
);

export default RecordListItem;
