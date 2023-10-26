import React, { useState, useCallback, useRef } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import CommunityListTemplate from "../components/templates/CommunityListTemplate";
import { showAlert } from "../functions";
import { useUpdateCommunity } from "../hooks/community/mutate";
import { useInfiniteQueryCommunities } from "../hooks/community/query";
import { useQueryUser } from "../hooks/user/query";
import { Category, CommunityStackScreenProps } from "../types";

const categories = [
  "all",
  "joining",
  "vegetable",
  "fruit",
  "fertilizer",
  "disease",
] as Category[];

const CommunityListScreen = ({
  navigation,
}: CommunityStackScreenProps<"CommunityList">) => {
  const { t } = useTranslation("community");
  const toast = useToast();

  const focusRef = useRef(true);
  const [categoryIndex, setCategoryIndex] = useState(1);
  const [isRefetchingCommunities, setIsRefetchingCommunities] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const {
    data: communities,
    isLoading: isLoadingCommunities,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryCommunities(categories[categoryIndex]);

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }
      refetch();
    }, [])
  );

  const {
    mutateAsync: mutateAsyncUpdateCommunity,
    isPending: isLoadingUpdateCommunity,
  } = useUpdateCommunity({
    onSuccess: () => {
      showAlert(
        toast,
        <Alert
          status="success"
          onPressCloseButton={() => toast.closeAll()}
          text={t("joined")}
        />
      );
    },
    onError: () => {
      showAlert(
        toast,
        <Alert
          status="error"
          onPressCloseButton={() => toast.closeAll()}
          text={t("error")}
        />
      );
    },
  });

  const refetchCommunities = useCallback(async () => {
    setIsRefetchingCommunities(true);
    await refetch();
    setIsRefetchingCommunities(false);
  }, []);

  const joinCommunity = useCallback(
    async (communityId: number, memberIds: string[]) => {
      if (user && !memberIds.includes(user.userId)) {
        memberIds.push(user.userId);
        await mutateAsyncUpdateCommunity({
          communityId,
          memberIds,
        });
        navigation.navigate("CommunityChat", {
          communityId,
          category: categories[categoryIndex],
        });
      }
    },
    [user, categoryIndex]
  );

  const communityChatNavigationHandler = useCallback(
    (communityId: number) => {
      navigation.navigate("CommunityChat", {
        communityId,
        category: categories[categoryIndex],
      });
    },
    [categoryIndex]
  );

  const postCommunityNavigationHandler = useCallback(() => {
    navigation.navigate("PostCommunity");
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("TabNavigator", {
      screen: "SettingNavigator",
      params: {
        screen: "Setting",
      },
    });
  }, []);

  const searchCommunityNavigationHandler = useCallback(() => {
    navigation.navigate("SearchCommunity", {
      category: categories[categoryIndex],
    });
  }, [categoryIndex]);

  return (
    <CommunityListTemplate
      categoryIndex={categoryIndex}
      setCategoryIndex={setCategoryIndex}
      communities={communities?.pages[0]}
      user={user}
      hasMore={hasNextPage}
      readMore={fetchNextPage}
      refetchCommunities={refetchCommunities}
      joinCommunity={joinCommunity}
      isLoading={isLoadingUser || isLoadingCommunities}
      isLoadingUpdateCommunity={isLoadingUpdateCommunity}
      isRefetchingCommunities={isRefetchingCommunities}
      communityChatNavigationHandler={communityChatNavigationHandler}
      postCommunityNavigationHandler={postCommunityNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
      searchCommunityNavigationHandler={searchCommunityNavigationHandler}
    />
  );
};

export default CommunityListScreen;
