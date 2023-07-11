import React from "react";
import { Feather } from "@expo/vector-icons";

import { Box, HStack, IconButton, Icon } from "native-base";
import { GetUserResponse } from "../../hooks/user/query";
import Avatar from "../molecules/Avatar";

type RentalDetailTemplateProps = {
  user: GetUserResponse | null | undefined;
  goBackNavigationHandler: () => void;
  settingNavigationHandler: () => void;
};

const RentalDetailTemplate = ({
  user,
  goBackNavigationHandler,
  settingNavigationHandler,
}: RentalDetailTemplateProps) => {

  return (
    <Box flex={1} pt="6" pb="12" px="2">
      <HStack alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="chevron-left" />} size="6" />}
          variant="unstyled"
          _pressed={{
            opacity: 0.5,
          }}
        />
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

export default RentalDetailTemplate;
