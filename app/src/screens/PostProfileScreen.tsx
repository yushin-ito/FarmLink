import React, { useCallback } from "react";
import PostProfileTemplate from "../components/templates/PostProfileTemplate";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/auth/useAuth";
import { useQueryUser } from "../hooks/user/query";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import { usePostUser } from "../hooks/user/mutate";
import Alert from "../components/molecules/Alert";
import { useTranslation } from "react-i18next";

const PostProfileScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("setting");
  const navigation = useNavigation();
  const { session } = useAuth();
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch,
  } = useQueryUser(session?.user.id);

  const { mutateAsync, isLoading: isLoadingPostProfile } = usePostUser({
    onSuccess: async () => {
      await refetch();
      navigation.goBack();
    },
    onError: () => {
      navigation.goBack();
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

  const postProfile = useCallback(
    async (name: string, profile: string) => {
      if (session) {
        await mutateAsync({
          userId: session.user.id,
          name,
          profile,
        });
      }
    },
    [session]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostProfileTemplate
      user={user}
      isLoadingUser={isLoadingUser}
      isLoadingPostProfile={isLoadingPostProfile}
      postProfile={postProfile}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostProfileScreen;
