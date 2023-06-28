import React, { memo } from "react";
import { Input as NativeBaseInput, IInputProps } from "native-base";

const Input = memo(({ ...props }: IInputProps) => {
  return (
    <NativeBaseInput
      py="3"
      fontSize="15"
      variant="outline"
      rounded="lg"
      borderColor="muted.400"
      _focus={{ bg: "transparent", borderColor: "brand.600" }}
      {...props}
    />
  );
});

export default Input;
