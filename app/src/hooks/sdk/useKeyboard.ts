import { useCallback, useEffect, useState } from "react";
import { Keyboard } from "react-native";

const useKeyboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", () =>
      setIsOpen(true)
    );

    return () => {
      subscription.remove();
    };
  });

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () =>
      setIsOpen(false)
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const onClose = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return { isOpen, onClose };
};

export default useKeyboard;
