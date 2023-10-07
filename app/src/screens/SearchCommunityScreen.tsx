import React, { useCallback, useState } from "react";
import SearchCommunityTemplate from "../components/templates/SearchCommunityTemplate";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  SearchCommunitiesResponse,
  useSearchCommunities,
} from "../hooks/community/mutate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { CommunityStackParamList, CommunityStackScreenProps } from "../types";

const SearchCommunitieScreen = ({
  navigation,
}: CommunityStackScreenProps<"SearchCommunity">) => {
  const { t } = useTranslation("community");
  const toast = useToast();
  const { params } =
    useRoute<RouteProp<CommunityStackParamList, "SearchCommunity">>();
  const [searchResult, setSearchResult] = useState<SearchCommunitiesResponse>();

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

  const searchCommunities = useCallback(async (query: string) => {
    if (query === "") {
      setSearchResult([]);
      return;
    }
    await mutateAsyncSearchCommunities(query);
  }, []);

  const communityChatNavigationHandler = useCallback(
    (communityId: number, name: string | null) => {
      navigation.goBack();
      navigation.navigate("CommunityChat", {
        communityId,
        name,
        category: params.category,
      });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchCommunityTemplate
      searchResult={searchResult}
      searchCommunities={searchCommunities}
      isLoadingSearchCommunities={isLoadingSearchCommunities}
      communityChatNavigationHandler={communityChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchCommunitieScreen;
