import {
  Box,
  Icon,
  FlatList,
  HStack,
  useColorModeValue,
  IconButton,
  Text,
  IScrollViewProps,
} from "native-base";
import React, { Dispatch, SetStateAction, memo, useState } from "react";
import Fab from "../molecules/Fab";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import SearchBar from "../organisms/SearchBar";
import { GetRentalsResponse } from "../../hooks/rental/query";
import RentalGridItem from "../organisms/RentalGridItem";
import { Scene } from "../../types";
import { Alert, RefreshControl, useWindowDimensions } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import SkeletonRentalGrid from "../organisms/SkeletonRentalGrid";

type RentalGridTemplateProps = {
  sceneIndex: number;
  setSceneIndex: Dispatch<SetStateAction<number>>;
  rentals: GetRentalsResponse | undefined;
  refetchRentals: () => void;
  isLoading: boolean;
  isRefetchingRentals: boolean;
  rentalDetailNavigationHandler: (rentalId: number) => void;
  searchMapNavigationHandler: () => void;
  postRentalNavigationHandler: () => void;
  goBackNavigationHandler: () => void;
};

type RentalGridProps = {
  rentals: GetRentalsResponse | undefined;
  scene: Scene;
  sceneIndex: number;
  refetchRentals: () => void;
  isLoading: boolean;
  isRefetchingRentals: boolean;
  rentalDetailNavigationHandler: (rentalId: number) => void;
};

const RentalGrid = memo(
  ({
    rentals,
    scene,
    sceneIndex,
    refetchRentals,
    isLoading,
    isRefetchingRentals,
    rentalDetailNavigationHandler,
    ...props
  }: RentalGridProps & IScrollViewProps) => {
    const spinnerColor = useColorModeValue("muted.600", "muted.100");
    const { width } = useWindowDimensions();
    const scenes = ["near", "popular", "newest"] as Scene[];

    return isLoading ||
      scene === scenes[sceneIndex + 1] ||
      scene === scenes[sceneIndex - 1] ? (
      <SkeletonRentalGrid rows={8} />
    ) : (
      <FlatList
        w={width}
        pt="2"
        px="2"
        numColumns={3}
        data={rentals?.filter((item) => item.imageUrls?.length)}
        renderItem={({ item }) => (
          <RentalGridItem
            item={item}
            onPress={() => rentalDetailNavigationHandler(item.rentalId)}
          />
        )}
        keyExtractor={(item) => item.rentalId.toString()}
        {...props}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingRentals}
            onRefresh={refetchRentals}
            tintColor={spinnerColor}
          />
        }
      />
    );
  }
);

const RentalGridTemplate = memo(
  ({
    rentals,
    sceneIndex,
    setSceneIndex,
    refetchRentals,
    isLoading,
    isRefetchingRentals,
    searchMapNavigationHandler,
    postRentalNavigationHandler,
    goBackNavigationHandler,
    rentalDetailNavigationHandler,
  }: RentalGridTemplateProps) => {
    const { t } = useTranslation("map");
    const bgColor = useColorModeValue("white", "#171717");
    const borderColor = useColorModeValue("#d4d4d4", "#525252");
    const textColor = useColorModeValue("#525252", "white");
    const iconColor = useColorModeValue("muted.600", "muted.100");

    const scenes = ["near", "popular", "newest"] as Scene[];
    const [routes] = useState(
      scenes.map((scene) => ({ key: scene, title: t(scene) }))
    );
    const { width } = useWindowDimensions();

    const renderScene = ({
      route,
    }: {
      route: {
        key: Scene;
        title: string;
      };
    }) => {
      if (route.key) {
        return (
          <RentalGrid
            rentals={rentals}
            scene={route.key}
            sceneIndex={sceneIndex}
            refetchRentals={refetchRentals}
            isLoading={isLoading}
            isRefetchingRentals={isRefetchingRentals}
            rentalDetailNavigationHandler={rentalDetailNavigationHandler}
          />
        );
      }
      return null;
    };

    return (
      <Box flex={1} safeAreaTop>
        <HStack
          mb="2"
          pl="1"
          pr="2"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton
            onPress={goBackNavigationHandler}
            icon={
              <Icon
                as={<Feather />}
                name="chevron-left"
                size="2xl"
                color={iconColor}
              />
            }
            pr="0"
            variant="unstyled"
          />
          <SearchBar
            maxW="70%"
            isReadOnly
            placeholder={t("searchRental")}
            onPressIn={searchMapNavigationHandler}
          />
          <IconButton
            onPress={() => Alert.alert(t("dev"))}
            icon={
              <Icon
                as={<Feather />}
                name="sliders"
                size="lg"
                color={iconColor}
              />
            }
            variant="unstyled"
          />
        </HStack>
        <TabView
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{
                borderBottomWidth: 3,
                borderBottomColor: "#75a43b",
                borderRadius: 2,
              }}
              renderLabel={({ route, color }) => (
                <Text style={{ color, fontWeight: "bold" }}>{route.title}</Text>
              )}
              style={{
                backgroundColor: bgColor,
              }}
              tabStyle={{
                minHeight: 40,
                paddingBottom: 12,
                borderBottomWidth: 0.5,
                borderBottomColor: borderColor,
              }}
              activeColor="#75a43b"
              inactiveColor={textColor}
              pressColor="transparent"
            />
          )}
          navigationState={{ index: sceneIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setSceneIndex}
          initialLayout={{ height: 0, width }}
        />
        <Fab
          position="absolute"
          bottom="24"
          right="6"
          onPress={postRentalNavigationHandler}
        >
          <Icon as={<Feather name="plus" />} size="4xl" color="white" />
        </Fab>
      </Box>
    );
  }
);

export default RentalGridTemplate;
