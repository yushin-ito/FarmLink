import React, { memo } from "react";

import {
  Box,
  Divider,
  HStack,
  Skeleton,
  VStack,
  useColorModeValue,
} from "native-base";

type SkeletonCommunityListProps = {
  rows: number;
};

const SkeletonCommunityList = memo(({ rows }: SkeletonCommunityListProps) => {
  const borderColor = useColorModeValue("muted.200", "muted.700");

  return (
    <VStack>
      {[...Array(rows)].map((_, index) => (
        <VStack key={index} alignItems="center">
          <HStack px="9" py="3" h="32">
            <Box w="25%">
              <Skeleton size="12" rounded="full" />
            </Box>
            <VStack w="75%" justifyContent="space-between">
              <Skeleton.Text lines={2} />
              <Skeleton.Text w="50%" lines={1} />
            </VStack>
          </HStack>
          <Divider w="80%" bg={borderColor} />
        </VStack>
      ))}
    </VStack>
  );
});

export default SkeletonCommunityList;
