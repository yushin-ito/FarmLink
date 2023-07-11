import React, { useCallback, useState } from "react";
import SearchFarmTemplate from "../components/templates/SearchFarmTemplate";
import { SearchFarmsResponse, useSearchFarms } from "../hooks/farm/mutate";
import { showAlert } from "../functions";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";
import Alert from "../components/molecules/Alert";
import { MapStackScreenProps } from "../types";

const SearchFarmScreen = ({
  navigation,
}: MapStackScreenProps<"SearchFarm">) => {
  const { t } = useTranslation("farm");
  const toast = useToast();
  const [searchResult, setSearchResult] = useState<SearchFarmsResponse>();

  const {
    mutateAsync: mutateAsyncSearchFarms,
    isLoading: isLoadingSearchFarms,
  } = useSearchFarms({
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
          text={t("anyError")}
        />
      );
    },
  });

  const searchFarms = useCallback(async (text: string) => {
    if (text === "") {
      setSearchResult([]);
      return;
    }
    await mutateAsyncSearchFarms(text);
  }, []);

  const farmDetailNavigationHandler = useCallback((farmId: number) => {
    navigation.goBack();
    navigation.navigate("FarmDetail", { farmId });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <SearchFarmTemplate
      searchResult={searchResult}
      searchFarms={searchFarms}
      isLoadingSearchFarms={isLoadingSearchFarms}
      farmDetailNavigationHandler={farmDetailNavigationHandler}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default SearchFarmScreen;
