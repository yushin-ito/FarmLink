import React, { ReactNode, memo } from "react";

import { Center, Pressable, IPressableProps } from "native-base";

type CirCleButtonProps = {
  buttonSize?: string;
  children: ReactNode;
};

const CircleButton = memo(
  ({
    buttonSize = "md",
    children,
    ...props
  }: CirCleButtonProps & IPressableProps) => {
    return (
      <Pressable {...props} mb="3">
        {({ isPressed }) => {
          return (
            <Center
              size={buttonSize}
              shadow="1"
              rounded="full"
              bg={isPressed ? "brand.700" : "brand.600"}
              style={{
                transform: [
                  {
                    scale: isPressed ? 0.96 : 1,
                  },
                ],
              }}
            >
              {children}
            </Center>
          );
        }}
      </Pressable>
    );
  }
);

export default CircleButton;
