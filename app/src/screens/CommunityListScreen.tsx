import React, { useState, useCallback } from "react";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useInfiniteQueryCommunities } from "../hooks/community/query";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import { Category, CommunityStackScreenProps } from "../types";
import CommunityListTemplate from "../components/templates/CommunityListTemplate";
import { useUpdateCommunity } from "../hooks/community/mutate";

const CommunityListScreen = ({
  navigation,
}: CommunityStackScreenProps<"CommunityList">) => {
  const toast = useToast();
  const { t } = useTranslation("community");
  const { session } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useQueryUser(
    session?.user.id
  );
  const categories = [
    "all",
    "joining",
    "vegetable",
    "fruit",
    "fertilizer",
    "disease",
  ] as Category[];
  const [categoryIndex, setCategoryIndex] = useState(0);
  const {
    data: communities,
    isLoading: isLoadingCommunities,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQueryCommunities(categories[categoryIndex], session?.user.id);
  const [isRefetchingCommunities, setIsRefetchingCommunities] = useState(false);

  const {
    mutateAsync: mutateAsyncUpdateCommunity,
    isLoading: isLoadingUpdateCommunity,
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
      if (session && !memberIds.includes(session.user.id)) {
        memberIds.push(session.user.id);
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
    [session, categoryIndex]
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
