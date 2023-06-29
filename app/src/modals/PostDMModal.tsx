import React, { useCallback } from "react";
import PostDMTemplate from "../components/templates/PostDMTemplate";
import { useNavigation } from "@react-navigation/native";
import { useInfiniteQueryDMs } from "../hooks/dm/query";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostDM } from "../hooks/dm/mutate";
import { useTranslation } from "react-i18next";

const PostDMModal = () => {
  const toast = useToast();
  const { t } = useTranslation("dm");
  const navigation = useNavigation();
  const { refetch } = useInfiniteQueryDMs();

  const { mutateAsync, isLoading } = usePostDM({
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

  const postDM = useCallback(async (dmName: string) => {
    await mutateAsync({
      dmName,
    });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostDMTemplate
      isLoading={isLoading}
      postDM={postDM}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostDMModal;
