import React, { useCallback, useState } from "react";

import SearchTalkTemplate from "../components/templates/SearchTalkTemplate";
import { GetTalksResponse, useQueryTalks } from "../hooks/talk/query";
import { TalkStackScreenProps } from "../types";

const SearchTalkScreen = ({
  navigation,
}: TalkStackScreenProps<"SearchTalk">) => {
  const [searchResult, setSearchResult] = useState<GetTalksResponse>();
  const { data: talks } = useQueryTalks();

  const searchTalks = useCallback(
    async (query: string) => {
      if (query === "") {
        setSearchResult(undefined);
        return;
      }
      setSearchResult(
        talks?.filter(
          (item) =>
            item.to?.name?.toUpperCase().indexOf(query.trim().toUpperCase()) !==
            -1
        )
      );
    },          
    [talks]
  );

  const talkChatNavigationHandler = useCallback((talkId: number) => {
    navigation.goBack();
    navigation.navigate("TalkChat", { talkId });
  }, []);

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

export default SearchTalkScreen;
