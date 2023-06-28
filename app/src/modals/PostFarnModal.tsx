import React, { useCallback } from "react";
import PostFarmTemplate from "../components/templates/PostFarmTemplate";
import { useNavigation } from "@react-navigation/native";
import { useQueryFarms } from "../hooks/farm/query";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostFarm } from "../hooks/farm/mutate";
import useAuth from "../hooks/auth/useAuth";
import { useTranslation } from "react-i18next";

const PostFarmModal = () => {
  const toast = useToast();
  const { t } = useTranslation("farm");
  const navigation = useNavigation();
  const { session } = useAuth();
  const { refetch } = useQueryFarms(session?.user.id);

  const { mutateAsync, isLoading } = usePostFarm({
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

  const postFarm = useCallback(async (farmName: string) => {
    await mutateAsync({ farmName, ownerId: session?.user.id });
  }, []);

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostFarmTemplate
      isLoading={isLoading}
      postFarm={postFarm}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostFarmModal;
