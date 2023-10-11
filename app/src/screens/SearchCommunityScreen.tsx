import React, { useCallback, useState } from "react";
import SearchCommunityTemplate from "../components/templates/SearchCommunityTemplate";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  SearchCommunitiesResponse,
  useSearchCommunities,
  useUpdateCommunity,
} from "../hooks/community/mutate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { CommunityStackParamList, CommunityStackScreenProps } from "../types";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";

const SearchCommunitieScreen = ({
  navigation,
}: CommunityStackScreenProps<"SearchCommunity">) => {
  const { t } = useTranslation("community");
  const toast = useToast();
  const { params } =
    useRoute<RouteProp<CommunityStackParamList, "SearchCommunity">>();
  const { session } = useAuth();
  const { data: user } = useQueryUser(session?.user.id);
  const [searchResult, setSearchResult] = useState<SearchCommunitiesResponse>();

  const {
    mutateAsync: mutateAsyncUpdateCommunity,
    isLoading: isLoadingUpdateCommunity,
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
    isLoading: isLoadingSearchCommunities,
  } = useSearchCommunities({
    onSuccess: (data) => {
      setSearchResult(data);
    },
    onError: () => {
      navigation.goBack();
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
      if (session) {
        memberIds.push(session.user.id);
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
    [session, params]
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
