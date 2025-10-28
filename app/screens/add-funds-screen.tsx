import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function AddFundsScreen() {
  const router = useRouter();

  const handleFundWithCard = () => {
    // Navigate to saved card screen
    router.push("/screens/saved-card-screen");
  };

  const handleBankTransfer = () => {
    // Navigate to bank transfer screen
    router.push("/screens/bank-transfer-screen");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Fund Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        {/* Fund with Card Option */}
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={handleFundWithCard}
        >
          <Text className="text-base">Fund with Card</Text>
        </TouchableOpacity>

        {/* Fund via Bank Transfer Option */}
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={handleBankTransfer}
        >
          <Text className="text-base">Fund via Bank Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
