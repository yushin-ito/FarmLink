import React, { memo } from "react";
import { Box, Divider, HStack, Skeleton, VStack } from "native-base";

type SkeletonFarmListProps = {
  rows: number;
};
const SkeletonFarmList = memo(({ rows }: SkeletonFarmListProps) => (
  <VStack>
    {[...Array(rows)].map((_, index) => (
      <VStack key={index} alignItems="center">
        <HStack
          h="20"
          px="9"
          py="3"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box w="20%">
            <Skeleton size="12" rounded="md" />
          </Box>
          <Box w="80%">
            <Skeleton.Text lines={2} />
          </Box>
        </HStack>
        <Divider w="80%" bg="muted.300" />
      </VStack>
    ))}
  </VStack>
));

export default SkeletonFarmList;
