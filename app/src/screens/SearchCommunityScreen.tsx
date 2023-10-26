import React, { useCallback, useState } from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import SearchCommunityTemplate from "../components/templates/SearchCommunityTemplate";
import { showAlert } from "../functions";
import {
  SearchCommunitiesResponse,
  useSearchCommunities,
  useUpdateCommunity,
} from "../hooks/community/mutate";
import { useQueryUser } from "../hooks/user/query";
import { CommunityStackParamList, CommunityStackScreenProps } from "../types";

const SearchCommunitieScreen = ({
  navigation,
}: CommunityStackScreenProps<"SearchCommunity">) => {
  const { t } = useTranslation("community");
  const toast = useToast();
  const { params } =
    useRoute<RouteProp<CommunityStackParamList, "SearchCommunity">>();

  const [searchResult, setSearchResult] = useState<SearchCommunitiesResponse>();

  const { data: user } = useQueryUser();

  const {
    mutateAsync: mutateAsyncUpdateCommunity,
    isPending: isLoadingUpdateCommunity,
  } = useUpdateCommunity({
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

  const {
    mutateAsync: mutateAsyncSearchCommunities,
    isPending: isLoadingSearchCommunities,
  } = useSearchCommunities({
    onSuccess: (data) => {
      setSearchResult(data);
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
          category: params.category,
        });
      }
    },
    [user, params]
  );

  const searchCommunities = useCallback(async (query: string) => {
    if (query === "") {
      setSearchResult([]);
      return;
    }
    await mutateAsyncSearchCommunities(query);
  }, []);

  const communityChatNavigationHandler = useCallback(
    (communityId: number) => {
      navigation.goBack();
      navigation.navigate("CommunityChat", {
        communityId,
        category: params.category,
      });
    },
    [params]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchCommunityTemplate
      user={user}
      searchResult={searchResult}
      searchCommunities={searchCommunities}
      joinCommunity={joinCommunity}
      isLoadingUpdateCommunity={isLoadingUpdateCommunity}
      isLoadingSearchCommunities={isLoadingSearchCommunities}
      communityChatNavigationHandler={communityChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchCommunitieScreen;
