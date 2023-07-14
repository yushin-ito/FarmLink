import React from "react";
import { Box, Divider, HStack, Skeleton, VStack } from "native-base";

const SkeltonCommunityList = () => {
  return (
    <VStack alignItems="center">
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
  );
};

export default SkeltonCommunityList;
