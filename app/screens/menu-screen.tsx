import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface MenuScreenProps {
  onClose: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onClose }) => {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    onClose();
    router.push(screen as any);
  };

  return (
    <View className="h-full bg-white p-6 w-4/5">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-xl font-bold">RUE Logistics</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <Text className="text-green-600 font-bold text-lg">23 Rides</Text>
        <Text className="text-green-600 font-bold">ONLINE!</Text>
      </View>

      <ScrollView>
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => handleNavigation("/screens/wallet-screen")}
        >
          <Text className="text-base">My Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => handleNavigation("/screens/history-screen")}
        >
          <Text className="text-base">History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => handleNavigation("/screens/settings-screen")}
        >
          <Text className="text-base">Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => handleNavigation("/screens/support-screen")}
        >
          <Text className="text-base">Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => {
            onClose();
            // Add logout logic here
          }}
        >
          <Text className="text-base">Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-4"
          onPress={() => handleNavigation("/screens/customer-mode-screen")}
        >
          <Text className="text-base text-blue-500">Customer Mode</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MenuScreen;
