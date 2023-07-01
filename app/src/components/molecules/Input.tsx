import React, { memo } from "react";
import { Input as NativeBaseInput, IInputProps } from "native-base";

const Input = memo(({ ref, ...props }: IInputProps) => {
  return (
    <NativeBaseInput
      ref={ref}
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
