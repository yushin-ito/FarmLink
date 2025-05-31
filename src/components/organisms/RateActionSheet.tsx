import React, { Dispatch, SetStateAction, memo, useEffect } from "react";

import { Actionsheet, Text, Radio, Box, useColorModeValue } from "native-base";
import { useTranslation } from "react-i18next";

import { Rate } from "../../types";

type RateActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  rate: Rate;
  setRate: Dispatch<SetStateAction<Rate>>;
  pop?: boolean;
};

const rates = ["all", "year", "month", "week", "day", "once"] as Rate[];

const RateActionSheet = memo(
  ({ isOpen, onClose, rate, setRate, pop }: RateActionSheetProps) => {
    const { t } = useTranslation("setting");

    const textColor = useColorModeValue("muted.600", "muted.200");

    useEffect(() => {
      if (pop) {
        rates.splice(rates.indexOf("all"), 1);
      }
    }, [pop]);

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Radio.Group
            name="rate"
            onChange={(value) => {
              setRate(value as Rate);
            }}
            value={rate.toString()}
          >
            {rates.map((rate, index) => (
              <Radio
                key={index}
                value={rate}
                ml="20"
                my="2"
                colorScheme="brand"
              >
                <Box ml="1" w="100%">
                  <Text color={textColor} bold>
                    {t(rate)}
                  </Text>
                </Box>
              </Radio>
            ))}
          </Radio.Group>
        </Actionsheet.Content>
      </Actionsheet>
    );
  }
);

export default RateActionSheet;
