import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { HStack, Icon, IconButton, Pressable, Text } from "native-base";
import { GetFarmsResponse } from "../../hooks/farm/query";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

type FarmItemProps = {
  item: GetFarmsResponse[number];
  deleteFarm: (farmId: number) => Promise<void>;
  onPress: () => void;
};

const FarmItem = memo(({ item, deleteFarm, onPress }: FarmItemProps) => {
  const { t } = useTranslation("farm");

  return (
    <Pressable onPress={onPress} _pressed={{ opacity: 0.8 }}>
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
          {item.name}
        </Text>
        <IconButton
          onPress={() =>
            Alert.alert(t("deleteFarm"), t("askDeleteFarm"), [
              {
                text: t("cancel"),
                style: "cancel",
              },
              {
                text: t("delete"),
                onPress: async () => await deleteFarm(item.farmId),
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
});

export default FarmItem;
