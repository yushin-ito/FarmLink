import React, { forwardRef, memo } from "react";
import {
  Input as NativeBaseInput,
  IInputProps,
  useColorModeValue,
} from "native-base";
import { TextInput } from "react-native";

const Input = memo(
  forwardRef<TextInput, IInputProps>(({ ...props }, ref) => {
    const borderColor = useColorModeValue("muted.400", "muted.200");
    return (
      <NativeBaseInput
        ref={ref || undefined}
        keyboardAppearance={useColorModeValue("light", "dark")}
        py="3"
        fontSize="15"
        variant="outline"
        rounded="lg"
        borderColor={borderColor}
        _focus={{ bg: "transparent", borderColor: "brand.600" }}
        {...props}
      />
    );
  })
);

export default Input;
