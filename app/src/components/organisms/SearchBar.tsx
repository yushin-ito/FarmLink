import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { Input, Icon, IInputProps, useColorModeValue } from "native-base";

const SearchBar = memo(({ ...props }: IInputProps) => {
  const bgColor = useColorModeValue("muted.200", "muted.700");
  const textColor = useColorModeValue("muted.600", "white");
  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Input
      variant="unstyled"
      placeholderTextColor={textColor}
      fontSize="md"
      rounded="lg"
      bg={bgColor}
      _focus={{ bg: bgColor }}
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
