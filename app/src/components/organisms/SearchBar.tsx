import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { Input, Icon, IInputProps } from "native-base";
import { useTranslation } from "react-i18next";

const SearchBar = memo(({ ...props }: IInputProps) => {
  const { t } = useTranslation("community");

  return (
    <Input
      variant="unstyled"
      placeholder={t("search")}
      placeholderTextColor="muted.600"
      fontSize="md"
      rounded="lg"
      bg="muted.300"
      _focus={{ bg: "muted.300" }}
      leftElement={<Icon as={<Feather />} name="search" size="4" ml="2" />}
      {...props}
    />
  );
});

export default SearchBar;
