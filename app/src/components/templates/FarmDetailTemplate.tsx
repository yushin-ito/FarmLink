import { Feather, Octicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  IconButton,
  ScrollView,
  Text,
} from "native-base";
import React from "react";
import { Image } from "expo-image";
import { GetDeviceResponse } from "../../hooks/device/query";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

type FarmDetailTemplateProps = {
  title: string | null;
  device: GetDeviceResponse | null | undefined;
  goBackNavigationHandler: () => void;
};

const FarmDetailTemplate = ({
  title,
  device,
  goBackNavigationHandler,
}: FarmDetailTemplateProps) => {
  const { t } = useTranslation("farm");

  return (
    <Box flex={1} pt="5" safeAreaTop>
      <HStack
        mb="2"
        pl="1"
        pr="3"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack alignItems="center">
          <IconButton
            onPress={goBackNavigationHandler}
            icon={<Icon as={<Feather />} name="chevron-left" size="2xl" />}
            variant="unstyled"
          />
          <Heading fontSize="xl">{title}</Heading>
        </HStack>
        <IconButton
          onPress={() => Alert.alert(t("dev"))}
          icon={<Icon as={<Feather />} name="share" size="lg" />}
          variant="unstyled"
        />
      </HStack>
      <ScrollView>
        <Box h="64" bg="muted.100">
          <Image
            source={{ uri: device?.imageUrl + "?=" + device?.updatedAt ?? "" }}
            style={{ flex: 1 }}
            cachePolicy="memory-disk"
          />
        </Box>
      </ScrollView>
      <HStack
        w="100%"
        pt="2"
        pb="8"
        px="6"
        space="2"
        shadow="2"
        borderTopRadius="3xl"
        bg="white"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          icon={
            <Icon as={<Octicons />} name="bell-fill" size="md" color="muted.300" />
          }
          variant="unstyled"
          borderWidth="1"
          rounded="lg"
          p="2"
          borderColor="muted.300"
        />
        <Button w="40" colorScheme="brand" rounded="lg">
          <Text bold fontSize="md" color="white">
            {t("edit")}
          </Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default FarmDetailTemplate;
