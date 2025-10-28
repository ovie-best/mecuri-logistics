import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuScreen from "./menu-screen";

interface UserData {
  name: string;
  isVerified: boolean;
}

export default function MerchantWelcomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/user/profile', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data - replace with actual API response
      const data: UserData = {
        name: "BENSON",
        isVerified: false,
      };

      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with menu and notification icons */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/screens/notifications-screen")}
        >
          <Ionicons name="notifications" size={28} color="#22c55e" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View className="flex-1 px-6 py-4">
        {/* Welcome Text */}
        <Text className="text-2xl font-bold mb-8">
          Welcome, {userData?.name || "User"}
        </Text>

        {/* Registration Card */}
        <View className="bg-green-500 rounded-3xl p-6 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <View className="absolute -right-10 -top-10 w-40 h-40 bg-green-400 rounded-full opacity-20" />
          <View className="absolute -right-5 top-20 w-32 h-32 bg-green-400 rounded-full opacity-20" />

          {/* Card Content */}
          <View className="relative z-10">
            <Text className="text-white text-3xl font-bold mb-4 leading-tight">
              Become a{"\n"}verified rider{"\n"}to earn!
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/screens/checklist-screen")}
              className="bg-gray-800 px-6 py-3 rounded-full self-start"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Illustration Area - Right side */}
          <View className="absolute right-6 top-6 bottom-6">
            {/* You can add an image/illustration here */}
            {/* <Image source={require('./rider-illustration.png')} /> */}
            <View className="w-32 h-32 items-center justify-center">
              <Ionicons name="bicycle" size={64} color="#fff" opacity={0.3} />
            </View>
          </View>
        </View>

        {/* Additional content can go here */}
      </View>

      {/* Menu Overlay - Slides in from left */}
      <MenuScreen visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
