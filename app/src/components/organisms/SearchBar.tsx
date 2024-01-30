import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import { Input, Icon, useColorModeValue, IInputProps } from "native-base";

const SearchBar = memo(({ ...props }: IInputProps) => {
  const bgColor = useColorModeValue("muted.200", "muted.700");
  const selectionColor = useColorModeValue("black", "white");
  const textColor = useColorModeValue("muted.500", "white");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Input
      keyboardAppearance={useColorModeValue("light", "dark")}
      variant="unstyled"
      placeholderTextColor={textColor}
      fontSize="md"
      rounded="lg"
      bg={bgColor}
      selectionColor={selectionColor}
      _focus={{ bg: bgColor, selectionColor }}
      leftElement={
        <Icon
          as={<Feather />}
          name="search"
          size="4"
          ml="2"
          color={iconColor}
        />
      }
      {...props}
    />
  );
});

export default SearchBar;
