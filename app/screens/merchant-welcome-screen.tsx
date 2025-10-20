import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CustomModal from "../components/custom-modal";
import NotificationsModal from "../components/notifications-modal";
import MenuScreen from "./menu-screen";
import NotificationsScreen from "./notifications-screen";

export default function MerchantWelcomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* Header with menu and notification icons */}
      <View className="flex-row justify-between items-center p-6 bg-white">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setNotificationsVisible(true)}>
          <Ionicons name="notifications-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View className="flex-1 bg-white p-6 justify-between">
        <View>
          <Text className="text-2xl font-bold mb-2">Welcome, BENSON</Text>
          <Text className="text-gray-500 mb-6">
            Complete registration to become a verified rider.
          </Text>

          <View className="bg-green-50 rounded-xl p-4">
            <Text className="text-green-700 font-bold mb-2">
              Become a verified rider to earn!
            </Text>
            <Text className="text-sm text-green-700 mb-4">Register</Text>
            <TouchableOpacity
              onPress={() => router.push("/screens/checklist-screen")}
              className="bg-green-500 px-4 py-2 rounded-full w-32 items-center"
            >
              <Text className="text-white font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-xs text-gray-400">App footer or legal text</Text>
      </View>

      {/* Menu Modal */}
      <CustomModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        animationType="slide"
        modalStyle={{ justifyContent: "flex-start" }}
      >
        <MenuScreen onClose={() => setMenuVisible(false)} />
      </CustomModal>

      {/* Notifications Modal */}
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
        animationType="slide"
        modalStyle={{ justifyContent: "flex-start" }}
        transparent={false}
      >
        <NotificationsScreen onClose={() => setNotificationsVisible(false)} />
      </NotificationsModal>
    </View>
  );
}
