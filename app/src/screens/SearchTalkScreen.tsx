import React, { useCallback, useState } from "react";
import SearchTalkTemplate from "../components/templates/SearchTalkTemplate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TalkStackParamList } from "../types";
import { GetTalksResponse, useQueryTalks } from "../hooks/talk/query";
import useAuth from "../hooks/auth/useAuth";

type SearchTalkNavigationProp = NativeStackNavigationProp<
  TalkStackParamList,
  "SearchTalk"
>;

const SearchTalkscreen = () => {
  const navigation = useNavigation<SearchTalkNavigationProp>();
  const [searchResult, setSearchResult] = useState<GetTalksResponse>();
  const { session } = useAuth();
  const { data } = useQueryTalks(session?.user.id);

  const searchTalks = useCallback(async (text: string) => {
    if (text === "") {
      setSearchResult([]);
      return;
    }
    setSearchResult(
      data?.filter(
        (item) =>
          item.to?.displayName
            ?.toUpperCase()
            .indexOf(text.trim().toUpperCase()) !== -1
      )
    );
  }, []);

  const talkChatNavigationHandler = useCallback(
    (talkId: number, displayName: string | null | undefined) => {
      navigation.goBack();
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
      talkChatNavigationHandler={talkChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchTalkscreen;
