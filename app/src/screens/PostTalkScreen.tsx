import React, { useCallback, useState } from "react";
import PostTalkTemplate from "../components/templates/PostTalkTemplate";
import { useNavigation } from "@react-navigation/native";
import { useQueryTalks } from "../hooks/talk/query";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostTalk } from "../hooks/talk/mutate";
import { useTranslation } from "react-i18next";
import { SearchUsersResponse, useSearchUsers } from "../hooks/user/mutate";
import useAuth from "../hooks/auth/useAuth";

const PostTalkScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("talk");
  const navigation = useNavigation();
  const { session } = useAuth();
  const { data: talks, refetch } = useQueryTalks(session?.user.id);
  const [searchResult, setSearchResult] = useState<SearchUsersResponse>();

  const {
    mutateAsync: mutateAsyncSearchUsers,
    isLoading: isLoadingSearchUsers,
  } = useSearchUsers({
    onSuccess: (data) => {
      setSearchResult(
        data.filter(
          (item) =>
            !talks?.some((talk) => talk.to.userId === item.userId) &&
            session?.user.id !== item.userId
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

  const { mutateAsync: mutateAsyncPostTalk, isLoading: isLoadingPostTalk } =
    usePostTalk({
      onSuccess: async () => {
        await refetch();
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
    [session]
  );

  const postTalk = useCallback(
    async (recieverId: string) => {
      if (session) {
        await mutateAsyncPostTalk({
          senderId: session?.user.id,
          recieverId,
        });
      }
    },
    [session]
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
