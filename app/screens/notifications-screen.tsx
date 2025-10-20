import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface NotificationsScreenProps {
  onClose: () => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onClose,
}) => {
  const handleAction = (action: string) => {
    onClose();
    // Handle different actions based on the notification type
    console.log(`Performing action: ${action}`);
  };

  return (
    <View className="h-full bg-white">
      {/* Notification Header */}
      <View className="flex-row justify-between items-center p-6 bg-gray-100">
        <Text className="text-xl font-bold">Notification</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Notification Content */}
      <ScrollView className="p-4">
        {/* Payment Notification */}
        <View className="bg-green-50 p-4 rounded-xl mb-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="font-bold text-green-800">PAYMENT!</Text>
            <Text className="text-xs text-gray-500">1:22 pm</Text>
          </View>
          <Text className="text-sm text-green-700 mb-3">
            You have just received #3200 (from Relo Joshua) as payment from your
            previous ride. Visit wallet to withdraw.
          </Text>
          <TouchableOpacity
            className="bg-green-500 px-4 py-2 rounded-full self-start"
            onPress={() => handleAction("checkWallet")}
          >
            <Text className="text-white text-sm">Check wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Debt Notification */}
        <View className="bg-red-50 p-4 rounded-xl mb-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="font-bold text-red-800">DEBT!</Text>
            <Text className="text-xs text-gray-500">1:35 pm</Text>
          </View>
          <Text className="text-sm text-red-700 mb-3">
            You still owe #200 as commission from your last ride. You have till
            Friday, 23rd September, 2024 to fund your wallet. Your account will
            be banned if you do not meet the given deadline. Go to wallet now
            and fund!
          </Text>
          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded-full self-start"
            onPress={() => handleAction("fundWallet")}
          >
            <Text className="text-white text-sm">Fund wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Notification */}
        <View className="bg-blue-50 p-4 rounded-xl">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="font-bold text-blue-800">WEEKLY STATISTICS</Text>
            <Text className="text-xs text-gray-500">1:42 pm</Text>
          </View>
          <Text className="text-sm text-blue-700">
            You&apos;ve had a phenomenal week!, a busy one choked with back to
            back deliveries. CONGRATULATIONSH! Click to see full statistics.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;
