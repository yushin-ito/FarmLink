import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { Input, Icon, IInputProps } from "native-base";

const SearchBar = memo(({ ...props }: IInputProps) => {
  return (
    <Input
      variant="unstyled"
      placeholderTextColor="muted.600"
      fontSize="md"
      rounded="lg"
      bg="muted.200"
      _focus={{ bg: "muted.200" }}
      leftElement={<Icon as={<Feather />} name="search" size="4" ml="2" />}
      {...props}
    />
  );
});

export default SearchBar;
