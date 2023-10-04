import { Divider, HStack, Icon, VStack, Skeleton } from "native-base";
import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";

type SkeletonNotificationProps = {
  rows: number;
};

const SkeletonNotification = memo(({ rows }: SkeletonNotificationProps) => (
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
            <Skeleton size="12" rounded={index % 2 === 1 ? "md" : "full"} />
            <Skeleton.Text w="40" lines={2} />
          </HStack>
          <Icon
            as={<Feather />}
            name="chevron-right"
            size="md"
            color="muted.200"
          />
        </HStack>
        <Divider w="90%" bg="muted.200" />
      </VStack>
    ))}
  </VStack>
));

export default SkeletonNotification;
