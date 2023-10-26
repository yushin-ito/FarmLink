import React, { memo } from "react";

import {
  Input as NativeBaseInput,
  IInputProps,
  useColorModeValue,
} from "native-base";

const Input = memo(({ ...props }: IInputProps) => {
  const selectionColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("muted.400", "muted.200");

  return (
    <NativeBaseInput
      keyboardAppearance={useColorModeValue("light", "dark")}
      py="3"
      fontSize="15"
      variant="outline"
      rounded="lg"
      borderColor={borderColor}
      _focus={{
        bg: "transparent",
        borderColor: "brand.600",
        selectionColor,
      }}
      selectionColor={selectionColor}
      {...props}
    />
  );
});

export default Input;
