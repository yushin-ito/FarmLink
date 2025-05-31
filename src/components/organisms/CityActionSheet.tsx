import React, { Dispatch, SetStateAction, memo } from "react";

import {
  Actionsheet,
  Text,
  Radio,
  Box,
  useColorModeValue,
  FlatList,
  Spinner,
  Center,
} from "native-base";

type CityActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  cities: { id: number; name: string }[];
  city: { id: number; name: string };
  setCity: Dispatch<SetStateAction<{ id: number; name: string }>>;
  isLoading: boolean;
};

const CityActionSheet = memo(
  ({
    isOpen,
    onClose,
    cities,
    city,
    setCity,
    isLoading,
  }: CityActionSheetProps) => {
    const textColor = useColorModeValue("muted.600", "muted.200");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content mb="-10">
          {isLoading ? (
            <Center w="100%" h="64">
              <Spinner color="muted.400" />
            </Center>
          ) : (
            <Radio.Group
              name="city"
              onChange={(value) => {
                const index = cities.findIndex(
                  (city) => city.id.toString() === value
                );
                if (index !== -1) setCity(cities[index]);
              }}
              value={city.id.toString()}
            >
              <FlatList
                w="100%"
                maxH="64"
                data={cities}
                renderItem={({ item }) => (
                  <Radio
                    value={item.id.toString()}
                    ml="20"
                    my="2"
                    colorScheme="brand"
                  >
                    <Box ml="1" w="100%">
                      <Text color={textColor} bold>
                        {item.name}
                      </Text>
                    </Box>
                  </Radio>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </Radio.Group>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    );
  }
);

export default CityActionSheet;
