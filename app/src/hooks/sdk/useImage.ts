import { useCallback, useState } from "react";

import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

type PickerResult = {
  uri: string;
  base64: string | undefined;
  size: { width: number; height: number };
};

type UseImageType = {
  onSuccess?: ({ uri, base64, size }: PickerResult) => void;
  onDisable?: () => void;
  onError?: () => void;
};

const useImage = ({ onSuccess, onDisable, onError }: UseImageType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uri, setUri] = useState<string | null>(null);

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
          [{ resize: { width: 700 } }],
          {
            compress: 0.5,
            base64: true,
          }
        );
        onSuccess &&
          onSuccess({
            uri: manipulatorResult.uri,
            base64: manipulatorResult.base64,
            size: {
              width: manipulatorResult.width,
              height: manipulatorResult.height,
            },
          });
        setUri(manipulatorResult.uri);
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
          [{ resize: { width: 700 } }],
          {
            compress: 0.5,
            base64: true,
          }
        );
        onSuccess &&
          onSuccess({
            uri: manipulatorResult.uri,
            base64: manipulatorResult.base64,
            size: {
              width: manipulatorResult.width,
              height: manipulatorResult.height,
            },
          });
        setUri(manipulatorResult.uri);
      }
    } catch (error) {
      onError && onError();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { pickImageByLibrary, pickImageByCamera, isLoading, uri };
};

export default useImage;
