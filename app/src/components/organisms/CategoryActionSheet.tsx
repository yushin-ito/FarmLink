import { Actionsheet, Text, Radio, Box } from "native-base";
import React, { Dispatch, SetStateAction, memo } from "react";
import { Category, getCategories } from "../../functions";
import { useTranslation } from "react-i18next";

type CategoryActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  categoryIndex: number;
  setCategoryIndex: Dispatch<SetStateAction<number>>;
};

const CategoryActionSheet = memo(
  ({
    isOpen,
    onClose,
    categoryIndex,
    setCategoryIndex,
  }: CategoryActionSheetProps) => {
    const { t } = useTranslation("community");
    const categories = getCategories()
    categories.splice(0, 1, "all")
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
            value={categoryIndex.toString()}
          >
            {
              categories.map((category, index) => (
                <Radio
                  key={index}
                  value={index.toString()}
                  ml="20"
                  my="2"
                  colorScheme="brand"
                >
                  <Box ml="1" w="100%">
                    <Text color="muted.600" bold>
                      {t(category as Category)}
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
