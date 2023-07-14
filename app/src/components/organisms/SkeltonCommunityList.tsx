import React from "react";
import { Box, Divider, HStack, Skeleton, VStack } from "native-base";

type SkeltonCommunityListProps = {
  rows: number;
};

const SkeltonCommunityList = ({ rows }: SkeltonCommunityListProps) => (
  <VStack>
    {[...Array(rows)].map((_, index) => (
      <VStack key={index} alignItems="center">
        <HStack px="9" py="3" h="32">
          <Box w="25%">
            <Skeleton size="12" rounded="full" />
          </Box>
          <VStack w="75%" justifyContent="space-between">
            <Skeleton.Text lines={2} />
            <Skeleton.Text lines={1} />
          </VStack>
        </HStack>
        <Divider w="80%" bg="muted.200" />
      </VStack>
    ))}
  </VStack>
);

export default SkeltonCommunityList;
