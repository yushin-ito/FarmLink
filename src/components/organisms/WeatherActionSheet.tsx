import React, { Dispatch, SetStateAction, memo } from "react";

import { Actionsheet, Text, Radio, Box, useColorModeValue } from "native-base";
import { useTranslation } from "react-i18next";

import { Weather } from "../../types";

type WeatherActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  weather: Weather;
  setWeather: Dispatch<SetStateAction<Weather>>;
};

const weathers = ["sunny", "cloudy", "rainy", "snowy"] as Weather[];

const WeatherActionSheet = memo(
  ({ isOpen, onClose, weather, setWeather }: WeatherActionSheetProps) => {
    const { t } = useTranslation("farm");

    const textColor = useColorModeValue("muted.600", "muted.200");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Radio.Group
            name="weather"
            onChange={(value) => {
              setWeather(value as Weather);
            }}
            value={weather}
          >
            {weathers.map((item, index) => (
              <Radio
                key={index}
                value={item}
                ml="20"
                my="2"
                colorScheme="brand"
              >
                <Box ml="1" w="100%">
                  <Text color={textColor} bold>
                    {t(item)}
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

export default WeatherActionSheet;
