import { HStack, VStack, Skeleton } from "native-base";
import React, { memo } from "react";

type SkeletonRentalGridProps = {
  rows: number;
};

const SkeletonRentalGrid = memo(({ rows }: SkeletonRentalGridProps) => {
  return (
    <VStack>
      {[...Array(rows)].map((_, index) => (
        <HStack
          key={index}
          alignItems="center"
          justifyContent="space-evenly"
          mt={index === 0 ? "4" : "2"}
          px="2"
        >
          <Skeleton size="110" rounded="sm" />
          <Skeleton size="110" rounded="sm" />
          <Skeleton size="110" rounded="sm" />
        </HStack>
      ))}
    </VStack>
  );
});

export default SkeletonRentalGrid;
