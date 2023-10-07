import React, { useCallback, useState } from "react";
import SearchTalkTemplate from "../components/templates/SearchTalkTemplate";
import { TalkStackScreenProps } from "../types";
import { GetTalksResponse, useQueryTalks } from "../hooks/talk/query";
import useAuth from "../hooks/auth/useAuth";

const SearchTalkScreen = ({
  navigation,
}: TalkStackScreenProps<"SearchTalk">) => {
  const [searchResult, setSearchResult] = useState<GetTalksResponse>();
  const { session } = useAuth();
  const { data } = useQueryTalks(session?.user.id);

  const searchTalks = useCallback(async (query: string) => {
    if (query === "") {
      setSearchResult([]);
      return;
    }
    setSearchResult(
      data?.filter(
        (item) =>
          item.to?.name?.toUpperCase().indexOf(query.trim().toUpperCase()) !==
          -1
      )
    );
  }, []);

  const talkChatNavigationHandler = useCallback(
    (
      talkId: number,
      recieverId: string,
      token: string | null,
      name: string
    ) => {
      navigation.goBack();
      navigation.navigate("TalkChat", { talkId, token, recieverId, name });
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

export default SearchTalkScreen;
