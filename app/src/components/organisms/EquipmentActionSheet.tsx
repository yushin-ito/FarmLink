import React, { Dispatch, SetStateAction, memo } from "react";

import { Actionsheet, Text, Radio, Box, useColorModeValue } from "native-base";
import { useTranslation } from "react-i18next";

import { Equipment } from "../../types";

type EquipmentActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment[];
  setEquipment: Dispatch<SetStateAction<Equipment[]>>;
};

const equipments = ["water", "parking", "hut", "tool"] as Equipment[];

const EquipmentActionSheet = memo(
  ({ isOpen, onClose, equipment, setEquipment }: EquipmentActionSheetProps) => {
    const { t } = useTranslation("setting");

    const textColor = useColorModeValue("muted.600", "muted.200");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {equipments.map((item, index) => (
            <Radio.Group
              key={index}
              name="equipment"
              onChange={(value) => {
                setEquipment([...equipment, value as Equipment]);
              }}
              value={equipment[index].toString()}
            >
              <Radio value={item} ml="20" my="2" colorScheme="brand">
                <Box ml="1" w="100%">
                  <Text color={textColor} bold>
                    {t("equipment")}
                  </Text>
                </Box>
              </Radio>
            </Radio.Group>
          ))}
        </Actionsheet.Content>
      </Actionsheet>
    );
  }
);

export default EquipmentActionSheet;
