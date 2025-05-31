import React, { Dispatch, SetStateAction, memo } from "react";

import {
  Actionsheet,
  Text,
  Radio,
  Box,
  useColorModeValue,
  FlatList,
} from "native-base";

type PrefectureActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  prefectures: { id: number; name: string }[];
  prefecture: { id: number; name: string };
  setPrefecture: Dispatch<SetStateAction<{ id: number; name: string }>>;
};

const PrefectureActionSheet = memo(
  ({
    isOpen,
    onClose,
    prefectures,
    prefecture,
    setPrefecture,
  }: PrefectureActionSheetProps) => {
    const textColor = useColorModeValue("muted.600", "muted.200");

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content mb="-10">
          <Radio.Group
            name="prefecture"
            onChange={(value) => {
              const index = prefectures.findIndex(
                (prefecture) => prefecture.id === Number(value)
              );
              if (index !== -1) setPrefecture(prefectures[index]);
            }}
            value={prefecture.id.toString()}
          >
            <FlatList
              w="100%"
              maxH="64"
              data={prefectures}
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
        </Actionsheet.Content>
      </Actionsheet>
    );
  }
);

export default PrefectureActionSheet;
