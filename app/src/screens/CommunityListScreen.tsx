import React, { useState, useCallback } from "react";
import { useToast } from "native-base";
import { getCategories, showAlert } from "../functions";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { useInfiniteQueryCommunities } from "../hooks/community/query";
import { useDeleteCommunity } from "../hooks/community/mutate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryUser } from "../hooks/user/query";
import useAuth from "../hooks/auth/useAuth";
import { CommunityStackParamList } from "../types";
import CommunityListTemplate from "../components/templates/CommunityListTemplate";

type CommunityListNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  "CommunityList"
>;

const CommunityListScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("community");
  const navigation = useNavigation<CommunityListNavigationProp>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
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
          text={t("anyError")}
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
    (communityId: number, communityName: string | null) => {
      navigation.navigate("CommunityChat", { communityId, communityName });
    },
    []
  );

  const postCommunityNavigationHandler = useCallback(() => {
    navigation.navigate("PostCommunity");
  }, []);

  const settingNavigationHandler = useCallback(() => {
    navigation.navigate("SettingNavigator", { screen: "Setting" });
  }, []);

  const searchCommunityNavigationHandler = useCallback(() => {
    navigation.navigate("SearchCommunity");
  }, []);

  return (
    <CommunityListTemplate
      categoryIndex={categoryIndex}
      setCategoryIndex={setCategoryIndex}
      communities={communities}
      user={user}
      isLoadingCommunities={isLoadingCommunities}
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
