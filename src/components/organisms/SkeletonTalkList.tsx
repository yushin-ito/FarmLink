import React, { memo } from "react";

import {
  Box,
  Divider,
  HStack,
  Skeleton,
  VStack,
  useColorModeValue,
} from "native-base";

type SkeletonTalkListProps = {
  rows: number;
};
const SkeletonTalkList = memo(({ rows }: SkeletonTalkListProps) => {
  const borderColor = useColorModeValue("muted.200", "muted.600");

  return (
    <VStack>
      {[...Array(rows)].map((_, index) => (
        <VStack key={index} alignItems="center">
          <HStack
            px="9"
            py="4"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box w="20%">
              <Skeleton size="12" rounded="full" />
            </Box>
            <Box w="80%">
              <Skeleton.Text lines={2} />
            </Box>
          </HStack>
          <Divider w="80%" bg={borderColor} />
        </VStack>
      ))}
    </VStack>
  );
});

export default SkeletonTalkList;
