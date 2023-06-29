import React, { useCallback, useState } from "react";
import SearchDMTemplate from "../components/templates/SearchDMTemplate";
import { useNavigation } from "@react-navigation/native";
import { SearchDMsResponse, useSearchDMs } from "../hooks/dm/mutate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DMStackParamList } from "../types";

type SearchDMNavigationProp = NativeStackNavigationProp<
  DMStackParamList,
  "SearchDM"
>;

const SearchDMscreen = () => {
  const { t } = useTranslation("dm");
  const toast = useToast();
  const navigation = useNavigation<SearchDMNavigationProp>();
  const [searchResult, setSearchResult] = useState<SearchDMsResponse>();

  const { mutateAsync: mutateAsyncSearchDMs, isLoading: isLoadingSearchDMs } =
    useSearchDMs({
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

  const searchDMs = useCallback(async (text: string) => {
    if (text === "") {
      setSearchResult([]);
      return;
    }
    await mutateAsyncSearchDMs(text);
  }, []);

  const dmChatNavigationHandler = useCallback(
    (dmId: number, dmName: string | null) => {
      navigation.navigate("DMChat", { dmId, dmName });
    },
    []
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchDMTemplate
      searchResult={searchResult}
      searchDMs={searchDMs}
      isLoadingSearchDMs={isLoadingSearchDMs}
      dmChatNavigationHandler={dmChatNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchDMscreen;
