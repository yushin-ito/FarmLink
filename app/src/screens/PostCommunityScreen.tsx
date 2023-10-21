import React, { useCallback } from "react";
import PostCommunityTemplate from "../components/templates/PostCommunityTemplate";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useInfiniteQueryCommunities } from "../hooks/community/query";
import { useToast } from "native-base";
import { showAlert } from "../functions";
import Alert from "../components/molecules/Alert";
import { usePostCommunity } from "../hooks/community/mutate";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/auth/useAuth";
import { Category, CommunityStackParamList } from "../types";

const PostCommunityScreen = () => {
  const toast = useToast();
  const { t } = useTranslation("community");
  const navigation = useNavigation();
  const { params } =
    useRoute<RouteProp<CommunityStackParamList, "PostCommunity">>();
  const { session } = useAuth();
  const { refetch } = useInfiniteQueryCommunities(
    params.category,
    session?.user.id
  );

  const { mutateAsync, isLoading } = usePostCommunity({
    onSuccess: async () => {
      await refetch();
      showAlert(
        toast,
        <Alert
          status="success"
          onPressCloseButton={() => toast.closeAll()}
          text={t("created")}
        />
      );
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

  const postCommunity = useCallback(
    async (name: string, description: string, category: Category) => {
      if (session) {
        await mutateAsync({
          name,
          description,
          category,
          ownerId: session?.user.id,
          color: `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`,
        });
      }
    },
    [session]
  );

  const goBackNavigationHandler = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <PostCommunityTemplate
      isLoading={isLoading}
      postCommunity={postCommunity}
      goBackNavigationHandler={goBackNavigationHandler}
    />
  );
};

export default PostCommunityScreen;
