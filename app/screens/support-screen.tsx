import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SupportScreen() {
  const router = useRouter();

  const SupportOption = ({
    icon,
    title,
    description,
    onPress,
  }: {
    icon: string;
    title: string;
    description: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center"
      onPress={onPress}
    >
      <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
        <Ionicons name={icon as any} size={24} color="#22c55e" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold mb-1">{title}</Text>
        <Text className="text-sm text-gray-500">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-6 bg-white mt-10">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Support</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        <Text className="text-gray-600 mb-6">How can we help you today?</Text>

        {/* Support Options */}
        <SupportOption
          icon="chatbubble-ellipses-outline"
          title="Live Chat"
          description="Chat with our support team"
          onPress={() => {}}
        />
        <SupportOption
          icon="call-outline"
          title="Call Us"
          description="Speak directly with support"
          onPress={() => {}}
        />
        <SupportOption
          icon="mail-outline"
          title="Email Support"
          description="Send us an email"
          onPress={() => {}}
        />
        <SupportOption
          icon="help-circle-outline"
          title="FAQ"
          description="Find answers to common questions"
          onPress={() => {}}
        />

        {/* Contact Info */}
        <View className="bg-green-50 rounded-xl p-4 mt-6">
          <Text className="font-bold mb-2">Contact Information</Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="call" size={16} color="#22c55e" />
            <Text className="text-sm ml-2">+234 XXX XXX XXXX</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="mail" size={16} color="#22c55e" />
            <Text className="text-sm ml-2">support@ruelogistics.com</Text>
          </View>
          <View className="flex-row items-start">
            <Ionicons name="time" size={16} color="#22c55e" />
            <Text className="text-sm ml-2">
              Available 24/7 for your support needs
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
