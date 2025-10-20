import React, { ReactNode } from "react";
import { Modal, StyleProp, View, ViewStyle } from "react-native";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  modalStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  animationType?: "none" | "slide" | "fade";
  transparent?: boolean;
}

const NotificationsModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  modalStyle,
  contentStyle,
  animationType = "fade",
  transparent = true,
}) => {
  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyle} className="flex-1">
        {children}
      </View>
    </Modal>
  );
};

export default NotificationsModal;
