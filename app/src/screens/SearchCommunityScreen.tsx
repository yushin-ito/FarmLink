import React, { useCallback, useState } from "react";
import SearchCommunityTemplate from "../components/templates/SearchCommunityTemplate";
import { useNavigation } from "@react-navigation/native";
import {
  SearchCommunitiesResponse,
  useSearchCommunities,
} from "../hooks/community/mutate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";

const SearchCommunitieScreen = () => {
  const { t } = useTranslation("community");
  const toast = useToast();
  const navigation = useNavigation();
  const [searchResult, setSearchResult] = useState<SearchCommunitiesResponse>();

  const {
    mutateAsync: mutateAsyncSearchCommunities,
    isLoading: isLoadingSearchCommunity,
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
          text={t("anyError")}
        />
      );
    },
  });

  const searchCommunities = useCallback(async (text: string) => {
    if (text === "") {
      setSearchResult([]);
      return;
    }
    await mutateAsyncSearchCommunities(text);
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchCommunityTemplate
      searchResult={searchResult}
      searchCommunities={searchCommunities}
      isLoadingSearchCommunity={isLoadingSearchCommunity}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchCommunitieScreen;
