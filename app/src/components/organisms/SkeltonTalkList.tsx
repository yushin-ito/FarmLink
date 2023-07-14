import React from "react";
import { Box, Divider, HStack, Skeleton, VStack } from "native-base";

const SkeltonTalkList = () => {
  return (
    <VStack alignItems="center">
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
  );
};

export default SkeltonTalkList;
