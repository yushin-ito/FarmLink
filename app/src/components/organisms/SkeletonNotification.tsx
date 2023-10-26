import React, { memo } from "react";

import { Feather } from "@expo/vector-icons";
import {
  Divider,
  HStack,
  Icon,
  VStack,
  Skeleton,
  useColorModeValue,
} from "native-base";

type SkeletonNotificationProps = {
  rows: number;
};

const SkeletonNotification = memo(({ rows }: SkeletonNotificationProps) => {
  const borderColor = useColorModeValue("muted.200", "muted.600");
  const iconColor = useColorModeValue("muted.300", "muted.600");

  return (
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
              <Skeleton size="12" rounded="full" />
              <Skeleton.Text w="40" lines={2} />
            </HStack>
            <Icon
              as={<Feather />}
              name="chevron-right"
              size="md"
              color={iconColor}
            />
          </HStack>
          <Divider w="90%" bg={borderColor} />
        </VStack>
      ))}
    </VStack>
  );
});

export default SkeletonNotification;
