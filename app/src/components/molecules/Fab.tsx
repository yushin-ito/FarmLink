import React, { memo } from "react";

import { Center, Pressable, IPressableProps } from "native-base";

type FabProps = {
  buttonSize?: string;
};

const Fab = memo(
  ({ buttonSize = "md", children, ...props }: FabProps & IPressableProps) => {
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

export default Fab;
