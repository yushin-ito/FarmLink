import React, { useCallback, useState } from "react";
import SearchTalkTemplate from "../components/templates/SearchTalkTemplate";
import { useNavigation } from "@react-navigation/native";
import { SearchTalksResponse, useSearchTalks } from "../hooks/talk/mutate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TalkStackParamList } from "../types";

type SearchTalkNavigationProp = NativeStackNavigationProp<
  TalkStackParamList,
  "SearchTalk"
>;

const SearchTalkscreen = () => {
  const { t } = useTranslation("talk");
  const toast = useToast();
  const navigation = useNavigation<SearchTalkNavigationProp>();
  const [searchResult, setSearchResult] = useState<SearchTalksResponse>();

  const {
    mutateAsync: mutateAsyncSearchTalks,
    isLoading: isLoadingSearchTalks,
  } = useSearchTalks({
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

  const searchTalks = useCallback(async (text: string) => {
    if (text === "") {
      setSearchResult([]);
      return;
    }
    await mutateAsyncSearchTalks(text);
  }, []);

  const talkChatNavigationHandler = useCallback(
    (talkId: number, displayName: string | null | undefined) => {
      navigation.navigate("TalkChat", { talkId, displayName });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchTalkTemplate
      searchResult={searchResult}
      searchTalks={searchTalks}
      isLoadingSearchTalks={isLoadingSearchTalks}
      talkChatNavigationHandler={talkChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchTalkscreen;
