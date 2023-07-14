import { Divider, HStack, Icon, VStack, Skeleton } from "native-base";
import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";

type SkeletonRentalListProps = {
  rows: number;
};

const SkeletonRentalList = memo(({ rows }: SkeletonRentalListProps) => (
  <VStack>
    {[...Array(rows)].map((_, index) => (
      <VStack alignItems="center" key={index}>
        <HStack
          w="100%"
          px="6"
          py="5"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack alignItems="center" space="3">
            <Skeleton size="12" rounded="md" />
            <Skeleton.Text w="40" lines={1} />
          </HStack>
          <Icon
            as={<Feather />}
            name="chevron-right"
            size="4"
            ml="2"
            color="muted.200"
          />
        </HStack>
        <Divider w="90%" bg="muted.200" />
      </VStack>
    ))}
  </VStack>
));

export default SkeletonRentalList;
