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

export default SearchTalkScreen;
