import { Box, HStack, Heading, Image } from "native-base";
import React from "react";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import BackButton from "../molecules/BackButton";
import { GetDeviceResponse } from "../../hooks/device";

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
          <BackButton onPress={goBackNavigationHandler} />
          <Heading fontSize="2xl">{title}</Heading>
        </HStack>
        <Avatar
          text={user?.displayName?.charAt(0)}
          avatarUrl={user?.avatarUrl}
          updatedAt={user?.updatedAt}
          hue={user?.hue}
          onPress={settingNavigationHandler}
        />
      </HStack>
      <Image
        source={{ uri: device?.imageUrl + "?=" + device?.updatedAt ?? "" }}
        alt=""
      />
    </Box>
  );
};

export default FarmDeviceTemplate;
