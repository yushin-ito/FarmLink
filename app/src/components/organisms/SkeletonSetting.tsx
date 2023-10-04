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
        mt="3"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack p="2" space="3" alignItems="center" rounded="md">
          <Skeleton size="6" rounded="full" />
          <Skeleton.Text w="32" lines={1} />
        </HStack>
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
