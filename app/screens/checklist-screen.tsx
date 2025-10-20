import { useRegistration } from "@/context/registration-context";
import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomModal from "../components/custom-modal";

export default function ChecklistScreen() {
  const { steps } = useRegistration();
  const [modalVisible, setModalVisible] = useState(false);

  const items: {
    key: string;
    label: string;
    screen: Href;
    required: boolean;
  }[] = [
    {
      key: "basicInfo",
      label: "Basic Info",
      screen: "/screens/basicInfo-screen",
      required: true,
    },
    {
      key: "accountDetails",
      label: "Account Details",
      screen: "/screens/accountDetails-screen",
      required: true,
    },
    {
      key: "selfie",
      label: "Selfie with ID or Driver License",
      screen: "/screens/selfie-screen",
      required: true,
    },
    {
      key: "driverLicense",
      label: "Driver's License",
      screen: "/screens/driverLiscense-screen",
      required: true,
    },
    {
      key: "vehicleInfo",
      label: "Vehicle Info",
      screen: "/screens/vehicleInfo-screen",
      required: true,
    },
    {
      key: "referral",
      label: "Agent Referral Code (optional)",
      screen: "/screens/referral-screen",
      required: false,
    },
  ];

  const allRequiredComplete = items
    .filter((i) => i.required)
    .every((i) => (steps as any)[i.key]);

  const handleSubmit = () => {
    setModalVisible(true);
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
          <Text className="text-xl text-center font-bold mb-4">
            Registration
          </Text>
        </View>
        <ScrollView>
          {items.map((item) => {
            const completed = (steps as any)[item.key];
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => router.push(item.screen)}
                className="flex-row justify-between items-center p-6 mb-4 bg-gray-50 rounded-[10px]"
              >
                <Text className="text-base">{item.label}</Text>
                <Text
                  className={`text-sm ${completed ? "text-green-600" : "text-gray-400"}`}
                >
                  {completed ? "✓" : "›"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          disabled={!allRequiredComplete}
          onPress={handleSubmit}
          className={`py-4 rounded-3xl items-center mt-10 ${allRequiredComplete ? "bg-green-500" : "bg-gray-300"}`}
        >
          <Text className="text-white font-semibold">Submit</Text>
        </TouchableOpacity>

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="You are now verified and eligible to make deliveries!"
          message="Stay online always to get notified when there is a booking."
          buttonText="Ok"
          onConfirm={() => router.push("/screens/merchant-app")}
        />
      </SafeAreaView>
    </View>
  );
}
