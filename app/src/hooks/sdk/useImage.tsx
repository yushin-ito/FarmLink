import { useCallback, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

type UseImageType = {
  onSuccess?: ({
    base64,
    type,
  }: {
    base64: string | undefined;
    type: "image" | "video" | undefined;
  }) => void;
  onDisable?: () => void;
  onError?: () => void;
};

const useImage = ({ onSuccess, onDisable, onError }: UseImageType) => {
  const [isLoading, setIsLoading] = useState(false);

  const pickImageByLibrary = useCallback(async () => {
    setIsLoading(true);
    try {
      const mediaLibrary =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaLibrary.status !== "granted") {
        onDisable && onDisable();
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        quality: 0.5,
      });

      if (!pickerResult.canceled) {
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          pickerResult.assets[0].uri,
          [{ resize: { width: 500 } }],
          {
            compress: 1,
            base64: true,
          }
        );
        onSuccess &&
          onSuccess({
            base64: manipulatorResult.base64,
            type: pickerResult.assets[0].type,
          });
      }
    } catch (error) {
      onError && onError();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pickImageByCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      const camera = await ImagePicker.requestCameraPermissionsAsync();
      if (camera.status !== "granted") {
        onDisable && onDisable();
        return;
      }

      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5,
      });

      if (!pickerResult.canceled) {
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          pickerResult.assets[0].uri,
          [{ resize: { width: 500 } }],
          {
            compress: 1,
            base64: true,
          }
        );
        onSuccess &&
          onSuccess({
            base64: manipulatorResult.base64,
            type: pickerResult.assets[0].type,
          });
      }
    } catch (error) {
      onError && onError();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { pickImageByLibrary, pickImageByCamera, isLoading };
};

export default useImage;
