import { Feather } from "@expo/vector-icons";
import { Box, HStack, Heading, Icon, IconButton } from "native-base";
import React from "react";
import { Image } from "expo-image";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import { GetDeviceResponse } from "../../hooks/device/query";

type FarmDeviceTemplateProps = {
  title: string | null;
  user: GetUserResponse | null | undefined;
  device: GetDeviceResponse | null | undefined;
  goBackNavigationHandler: () => void;
  settingNavigationHandler: () => void;
};

const FarmDeviceTemplate = ({
  title,
  user,
  device,
  goBackNavigationHandler,
  settingNavigationHandler,
}: FarmDeviceTemplateProps) => {
  return (
    <Box flex={1} pt="5" safeAreaTop>
      <HStack
        mb="4"
        pl="3"
        pr="9"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack alignItems="center" space="3">
          <IconButton
            onPress={goBackNavigationHandler}
            icon={<Icon as={<Feather name="chevron-left" />} size="2xl" />}
            variant="unstyled"
          />
          <Heading fontSize="2xl">{title}</Heading>
        </HStack>
        <Avatar
          text={user?.name?.charAt(0)}
          uri={user?.avatarUrl}
          color={user?.color}
          onPress={settingNavigationHandler}
          updatedAt={user?.updatedAt}
        />
      </HStack>
      <Image
        source={{ uri: device?.imageUrl + "?=" + device?.updatedAt ?? "" }}
      />
    </Box>
  );
};

export default FarmDeviceTemplate;
