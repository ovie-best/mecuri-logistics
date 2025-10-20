import { useRegistration } from "@/context/registration-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReferralScreen() {
  const { setStep } = useRegistration();
  const router = useRouter();

  const confirm = () => {
    setStep("referral", true);
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <SafeAreaView>
        <View className="flex-row justify-between p-6 bg-white">
          <TouchableOpacity
            onPress={() => router.push("/screens/merchant-welcome-screen")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl text-center font-bold mb-4">
            Agent Referral Code
          </Text>
        </View>

        <TextInput
          placeholder="Referral code (optional)"
          className="border p-3 rounded mb-4"
        />

        <TouchableOpacity
          onPress={confirm}
          className="bg-green-500 py-4 rounded-3xl items-center mt-10"
        >
          <Text className="text-white font-semibold">Confirm</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
