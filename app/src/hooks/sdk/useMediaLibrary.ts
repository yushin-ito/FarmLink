import { useState, useCallback } from "react";

import * as MediaLibrary from "expo-media-library";

type UseMediaLibraryType = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onDisable?: () => void;
};

const useMediaLibrary = ({
  onSuccess,
  onError,
  onDisable,
}: UseMediaLibraryType) => {
  const [isLoading, setIsLoading] = useState(false);

  const saveToLibrary = useCallback(async (localUri: string) => {
    setIsLoading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        onDisable && onDisable;
        return;
      }
      await MediaLibrary.saveToLibraryAsync(localUri);
    } catch (error) {
      if (error instanceof Error) {
        onError && onError(error);
      }
    } finally {
      setIsLoading(false);
      onSuccess && onSuccess();
    }
  }, []);
  return {
    isLoading,
    saveToLibrary,
  };
};

export default useMediaLibrary;
