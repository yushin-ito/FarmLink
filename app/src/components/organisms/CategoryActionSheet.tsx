import { Actionsheet, Text, Radio, Box } from "native-base";
import React, { Dispatch, SetStateAction, memo } from "react";

type CategoryActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  categores: string[];
  setCategoryIndex: Dispatch<SetStateAction<number>>;
};

const CategoryActionSheet = memo(
  ({
    isOpen,
    onClose,
    categores,
    setCategoryIndex,
  }: CategoryActionSheetProps) => {
    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Radio.Group
            name="categories"
            defaultValue="0"
            onChange={(value) => {
              setCategoryIndex(Number(value));
              onClose();
            }}
          >
            {categores.map((category, index) => (
              <Radio
                key={index}
                value={index.toString()}
                ml="20"
                my="2"
                colorScheme="brand"
              >
                <Box ml="1" w="100%">
                  <Text color="muted.600" bold>
                    {category}
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

export default CategoryActionSheet;
