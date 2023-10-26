import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import { HStack, Icon, Skeleton, VStack, useColorModeValue } from "native-base";

type SkeletonSettingProps = {
  rows: number;
};
const SkeletonSetting = memo(({ rows }: SkeletonSettingProps) => {
  const iconColor = useColorModeValue("muted.300", "muted.600");

  return (
    <VStack>
      {[...Array(rows)].map((_, index) => (
        <HStack
          key={index}
          mt={index === 0 ? "3" : "6"}
          alignItems="center"
          justifyContent="space-between"
        >
          <Skeleton.Text w="40" p="2" lines={1} />
          <Icon
            as={<Feather />}
            name="chevron-right"
            size="md"
            color={iconColor}
          />
        </HStack>
      ))}
    </VStack>
  );
});

export default SkeletonSetting;
