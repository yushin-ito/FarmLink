import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { HStack, Icon, Skeleton, VStack } from "native-base";

type SkeletonSettingProps = {
  rows: number;
};
const SkeletonSetting = memo(({ rows }: SkeletonSettingProps) => (
  <VStack>
    {[...Array(rows)].map((_, index) => (
      <HStack
        key={index}
        mt="5"
        alignItems="center"
        justifyContent="space-between"
      >
        <Skeleton.Text w="40" p="2" lines={1} />
        <Icon
          as={<Feather />}
          name="chevron-right"
          size="md"
          color="muted.300"
        />
      </HStack>
    ))}
  </VStack>
));

export default SkeletonSetting;
