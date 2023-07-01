import { Box, HStack, Heading } from "native-base";
import React from "react";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";
import BackButton from "../molecules/BackButton";
type FarmCameraTemplateProps = {
  title: string | null;
  user: GetUserResponse | null | undefined;
  goBackNavigationHandler: () => void;
  settingNavigationHandler: () => void;
};

const FarmCameraTemplate = ({
  title,
  user,
  goBackNavigationHandler,
  settingNavigationHandler,
}: FarmCameraTemplateProps) => {
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
    </Box>
  );
};

export default FarmCameraTemplate;
