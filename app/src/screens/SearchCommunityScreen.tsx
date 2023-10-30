import React, { useCallback, useState } from "react";

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
import { CommunityStackScreenProps } from "../types";

const SearchCommunitieScreen = ({
  navigation,
}: CommunityStackScreenProps<"SearchCommunity">) => {
  const { t } = useTranslation("community");
  const toast = useToast();

  const [searchResult, setSearchResult] = useState<SearchCommunitiesResponse>();

  const { data: user } = useQueryUser();

  const {
    mutateAsync: mutateAsyncUpdateCommunity,
    isPending: isLoadingUpdateCommunity,
  } = useUpdateCommunity({
    onSuccess: (data) => {
      if (data) {
        navigation.goBack();
        navigation.navigate("CommunityChat", {
          communityId: data.communityId,
        });
      }
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
      }
    },
    [user]
  );

  const searchCommunities = useCallback(async (query: string) => {
    if (query === "") {
      setSearchResult(undefined);
      return;
    }
    await mutateAsyncSearchCommunities({ query, userId: user?.userId });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchCommunityTemplate
      searchResult={searchResult}
      searchCommunities={searchCommunities}
      joinCommunity={joinCommunity}
      isLoadingUpdateCommunity={isLoadingUpdateCommunity}
      isLoadingSearchCommunities={isLoadingSearchCommunities}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchCommunitieScreen;
