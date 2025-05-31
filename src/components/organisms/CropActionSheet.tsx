import React, { Dispatch, SetStateAction, memo } from "react";

import {
  Actionsheet,
  Text,
  Radio,
  Box,
  useColorModeValue,
  ScrollView,
} from "native-base";
import { useTranslation } from "react-i18next";

import { Crop } from "../../types";

type CropActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  crop: Crop;
  setCrop: Dispatch<SetStateAction<Crop>>;
};

const crops = [
  "carrot",
  "corn",
  "cucumber",
  "onion",
  "potato",
  "pumpkin",
  "tomato",
] as Crop[];

const CropActionSheet = memo(
  ({ isOpen, onClose, crop, setCrop }: CropActionSheetProps) => {
    const { t } = useTranslation("crop");

    const textColor = useColorModeValue("muted.600", "muted.200");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content mb="-10">
          <Radio.Group
            name="crop"
            onChange={(value) => {
              setCrop(value as Crop);
            }}
            value={crop}
          >
            <ScrollView
              w="100%"
              maxH="64"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {crops.map((crop, index) => (
                <Radio
                  key={index}
                  value={crop}
                  ml="20"
                  my="2"
                  colorScheme="brand"
                >
                  <Box ml="1" w="100%">
                    <Text color={textColor} bold>
                      {t(crop)}
                    </Text>
                  </Box>
                </Radio>
              ))}
            </ScrollView>
          </Radio.Group>
        </Actionsheet.Content>
      </Actionsheet>
    );
  }
);

export default CropActionSheet;
