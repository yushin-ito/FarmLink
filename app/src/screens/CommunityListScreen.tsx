import React, { useState, useCallback } from "react";
import { useToast } from "native-base";
import { getCategories, showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useInfiniteQueryCommunities } from "../hooks/community/query";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import { CommunityStackScreenProps } from "../types";
import CommunityListTemplate from "../components/templates/CommunityListTemplate";
import { usePostCommunity } from "../hooks/community/mutate";

const CommunityListScreen = ({
  navigation,
}: CommunityStackScreenProps<"CommunityList">) => {
  const toast = useToast();
  const { t } = useTranslation("community");
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const categories = getCategories();
  categories.splice(0, 1, "all", "joined");
  const [categoryIndex, setCategoryIndex] = useState(1);
  const {
    data: communities,
    isLoading: isLoadingCommunities,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryCommunities(categories[categoryIndex], session?.user.id);
  const [isRefetchingCommunities, setIsRefetchingCommunitys] = useState(false);

  const {
    mutateAsync: mutateAsyncPostCommunity,
    isLoading: isLoadingPostCommunity,
  } = usePostCommunity({
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
    setIsRefetchingCommunitys(true);
    await refetch();
    setIsRefetchingCommunitys(false);
  }, []);

  const joinCommunity = useCallback(
    async (communityId: number, name: string | null, memberIds: string[]) => {
      if (session) {
        memberIds.push(session.user.id);
        await mutateAsyncPostCommunity({
          communityId,
          memberIds,
        });
        navigation.navigate("CommunityChat", {
          communityId,
          name,
          category: categories[categoryIndex],
        });
      }
    },
    [session, user, categoryIndex]
  );

  const communityChatNavigationHandler = useCallback(
    (communityId: number, name: string | null) => {
      navigation.navigate("CommunityChat", {
        communityId,
        name,
        category: categories[categoryIndex],
      });
    },
    [categoryIndex]
  );

  const postCommunityNavigationHandler = useCallback(() => {
    navigation.navigate("PostCommunity", {
      category: categories[categoryIndex],
    });
  }, [categoryIndex]);

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
      communities={communities}
      user={user}
      isLoading={isLoadingUser || isLoadingCommunities}
      isLoadingPostCommunity={isLoadingPostCommunity}
      isRefetchingCommunities={isRefetchingCommunities}
      hasMore={hasNextPage}
      readMore={fetchNextPage}
      refetchCommunities={refetchCommunities}
      joinCommunity={joinCommunity}
      communityChatNavigationHandler={communityChatNavigationHandler}
      postCommunityNavigationHandler={postCommunityNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
      searchCommunityNavigationHandler={searchCommunityNavigationHandler}
    />
  );
};

export default CommunityListScreen;
