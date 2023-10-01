import React, { useState, useCallback } from "react";
import { useToast } from "native-base";
import { getCategories, showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useInfiniteQueryCommunities } from "../hooks/community/query";
import { useDeleteCommunity } from "../hooks/community/mutate";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import { CommunityStackScreenProps } from "../types";
import CommunityListTemplate from "../components/templates/CommunityListTemplate";

const CommunityListScreen = ({
  navigation,
}: CommunityStackScreenProps<"CommunityList">) => {
  const toast = useToast();
  const { t } = useTranslation("community");
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(session?.user.id);
  const categories = getCategories();
  categories.splice(0, 1, "all");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const {
    data: communities,
    isLoading: isLoadingCommunities,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryCommunities(categories[categoryIndex]);
  const [isRefetchingCommunities, setIsRefetchingCommunitys] = useState(false);

  const { mutateAsync: mutateAsyncDeleteCommunity } = useDeleteCommunity({
    onSuccess: async () => {
      await refetch();
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
    setIsRefetchingCommunitys(true);
    await refetch();
    setIsRefetchingCommunitys(false);
  }, []);

  const deleteCommunity = useCallback(async (communityId: number) => {
    await mutateAsyncDeleteCommunity(communityId);
  }, []);

  const communityChatNavigationHandler = useCallback(
    (communityId: number, name: string) => {
      navigation.navigate("CommunityChat", {
        communityId,
        name,
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
      communities={communities}
      user={user}
      isLoading={isLoadingUser || isLoadingCommunities}
      isRefetchingCommunities={isRefetchingCommunities}
      hasMore={hasNextPage}
      readMore={fetchNextPage}
      refetchCommunities={refetchCommunities}
      deleteCommunity={deleteCommunity}
      communityChatNavigationHandler={communityChatNavigationHandler}
      postCommunityNavigationHandler={postCommunityNavigationHandler}
      settingNavigationHandler={settingNavigationHandler}
      searchCommunityNavigationHandler={searchCommunityNavigationHandler}
    />
  );
};

export default CommunityListScreen;
