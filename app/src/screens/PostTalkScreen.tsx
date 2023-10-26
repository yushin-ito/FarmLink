import React, { useCallback, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostTalkTemplate from "../components/templates/PostTalkTemplate";
import { showAlert } from "../functions";
import { usePostTalk } from "../hooks/talk/mutate";
import { useQueryTalks } from "../hooks/talk/query";
import { SearchUsersResponse, useSearchUsers } from "../hooks/user/mutate";
import { useQueryUser } from "../hooks/user/query";

const PostTalkScreen = () => {
  const { t } = useTranslation("talk");
  const toast = useToast();
  const navigation = useNavigation();

  const [searchResult, setSearchResult] = useState<SearchUsersResponse>();

  const { data: user } = useQueryUser();
  const { data: talks } = useQueryTalks();

  const {
    mutateAsync: mutateAsyncSearchUsers,
    isPending: isLoadingSearchUsers,
  } = useSearchUsers({
    onSuccess: (data) => {
      setSearchResult(
        data.filter(
          (item) =>
            !talks?.some((talk) => talk.to.userId === item.userId) &&
            user?.userId !== item.userId
        )
      );
    },
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

  const { mutateAsync: mutateAsyncPostTalk, isPending: isLoadingPostTalk } =
    usePostTalk({
      onSuccess: async () => {
        navigation.goBack();
      },
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

  const searchUsers = useCallback(
    async (query: string) => {
      if (query === "") {
        setSearchResult([]);
        return;
      }
      await mutateAsyncSearchUsers(query);
    },
    [user]
  );

  const postTalk = useCallback(
    async (recieverId: string) => {
      if (user) {
        await mutateAsyncPostTalk({
          senderId: user.userId,
          recieverId,
        });
      }
    },
    [user]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostTalkTemplate
      searchResult={searchResult}
      searchUsers={searchUsers}
      isLoadingPostTalk={isLoadingPostTalk}
      isLoadingSearchUsers={isLoadingSearchUsers}
      postTalk={postTalk}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostTalkScreen;
