import React, { memo } from "react";
import { Box, Divider, HStack, Skeleton, VStack } from "native-base";

type SkeltonFarmListProps = {
  rows: number;
};
const SkeltonFarmList = memo(({ rows }: SkeltonFarmListProps) => (
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
            <Skeleton size="12" rounded="full" />
          </Box>
          <Box w="80%">
            <Skeleton.Text lines={2} />
          </Box>
        </HStack>
        <Divider w="80%" bg="muted.200" />
      </VStack>
    ))}
  </VStack>
));

export default SkeltonFarmList;
