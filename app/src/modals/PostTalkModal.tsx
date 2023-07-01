import React, { useCallback } from "react";
import PostTalkTemplate from "../components/templates/PostTalkTemplate";
import { useNavigation } from "@react-navigation/native";
import { useInfiniteQueryTalks } from "../hooks/talk/query";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostTalk } from "../hooks/talk/mutate";
import { useTranslation } from "react-i18next";

const PostTalkModal = () => {
  const toast = useToast();
  const { t } = useTranslation("talk");
  const navigation = useNavigation();
  const { refetch } = useInfiniteQueryTalks();

  const { mutateAsync, isLoading } = usePostTalk({
    onSuccess: async () => {
      await refetch();
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

  const postTalk = useCallback(async (userId: string) => {
    await mutateAsync({
      userId,
    });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostTalkTemplate
      isLoading={isLoading}
      postTalk={postTalk}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostTalkModal;
