import React, { useCallback, useMemo, useRef, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useTranslation } from "react-i18next";

import Alert from "../components/molecules/Alert";
import PostTalkTemplate from "../components/templates/PostTalkTemplate";
import { showAlert } from "../functions";
import { usePostTalk } from "../hooks/talk/mutate";
import { useQueryTalks } from "../hooks/talk/query";
import { SearchUsersResponse, useSearchUsers } from "../hooks/user/mutate";
import { useInfiniteQueryUsers, useQueryUser } from "../hooks/user/query";
import { TalkStackScreenProps } from "../types";

const PostTalkScreen = ({ navigation }: TalkStackScreenProps<"PostTalk">) => {
  const { t } = useTranslation("talk");
  const toast = useToast();

  const focusRef = useRef(true);
  const [searchResult, setSearchResult] = useState<SearchUsersResponse>();

  const { data: user, isLoading: isLoadingUser } = useQueryUser();
  const { data: talks, isLoading: isLoadingTalks } = useQueryTalks();
  const {
    data: users,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingUsers,
  } = useInfiniteQueryUsers();

  useFocusEffect(
    useCallback(() => {
      if (focusRef.current) {
        focusRef.current = false;
        return;
      }
    }, [])
  );

  const {
    mutateAsync: mutateAsyncSearchUsers,
    isPending: isLoadingSearchUsers,
  } = useSearchUsers({
    onSuccess: (data) => {
      setSearchResult(data);
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
        setSearchResult(undefined);
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

  const searchUsersResult = useMemo(
    () =>
      (searchResult ?? users?.pages[0])?.filter(
        (item) => !talks?.some((talk) => talk.to.userId === item.userId)
      ),
    [searchResult, talks, users]
  );

  return (
    <PostTalkTemplate
      searchResult={searchUsersResult}
      hasMore={hasNextPage}
      readMore={fetchNextPage}
      searchUsers={searchUsers}
      postTalk={postTalk}
      isLoading={
        isLoadingUser ||
        isLoadingTalks ||
        isLoadingUsers ||
        isLoadingSearchUsers
      }
      isLoadingPostTalk={isLoadingPostTalk}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostTalkScreen;
