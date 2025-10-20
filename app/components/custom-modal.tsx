import React, { ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  buttonColor?: string;
  children?: ReactNode;
  showCloseButton?: boolean;
  animationType?: "none" | "slide" | "fade";
  modalStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  transparent?: boolean;
  onConfirm?: () => void; // **NEW** callback for navigation or other actions
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  buttonText = "Ok",
  buttonColor = "#10B981",
  children,
  showCloseButton = true,
  animationType = "fade",
  modalStyle,
  contentStyle,
  transparent = true,
  onConfirm,
}) => {
  const handlePress = () => {
    if (onConfirm) {
      onConfirm(); // Navigate or perform custom logic
    }
    onClose(); // Close modal after confirm action
  };

  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center bg-black/70"
        style={modalStyle}
      >
        <View
          className="bg-white rounded-2xl p-6 items-center shadow-lg w-4/5 max-w-md"
          style={contentStyle}
        >
          {title && (
            <Text className="text-xl font-bold text-center mb-4">{title}</Text>
          )}

          {message && (
            <Text className="text-base text-center text-gray-600 mb-6">
              {message}
            </Text>
          )}

          {children && <View className="w-full mb-6">{children}</View>}

          {showCloseButton && (
            <Pressable
              onPress={handlePress}
              className="px-6 py-3 rounded-xl w-full items-center"
              style={{ backgroundColor: buttonColor }}
            >
              <Text className="text-white font-semibold text-base">
                {buttonText}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
