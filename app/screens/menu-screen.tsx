// File: app/components/menu-screen.tsx
// This is a reusable menu component with slide-in animation

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MENU_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen width

interface UserProfile {
  name: string;
  avatar?: string;
  totalRides: number;
  rating: number;
  isOnline: boolean;
}

interface MenuScreenProps {
  visible: boolean;
  onClose: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (visible) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [visible]);

  const fetchUserProfile = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/rider/profile', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data - replace with actual API response
      const data: UserProfile = {
        name: "RUE Logistics",
        avatar: undefined,
        totalRides: 23,
        rating: 4.5,
        isOnline: true,
      };

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const openMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 20,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 20,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 20,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 20,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNavigation = (screen: string) => {
    onClose();
    // Delay to let animation finish (2 seconds)
    setTimeout(() => {
      router.push(screen as any);
    });
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      // Logout logic will be handled in settings screen
      router.push("/screens/settings-screen");
    });
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-6"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon as any} size={24} color="#000" />
      <Text className="text-base ml-4">{label}</Text>
    </TouchableOpacity>
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Ionicons
            key={i}
            name="star"
            size={14}
            color="#fbbf24"
            style={{ marginRight: 2 }}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={14}
            color="#fbbf24"
            style={{ marginRight: 2 }}
          />
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={14}
            color="#fbbf24"
            style={{ marginRight: 2 }}
          />
        );
      }
    }
    return stars;
  };

  const getInitials = (name: string) => {
    if (!name) return "R";
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {/* Backdrop/Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: fadeAnim,
          }}
        />
      </TouchableWithoutFeedback>

      {/* Menu Panel */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: MENU_WIDTH,
          transform: [{ translateX: slideAnim }],
          backgroundColor: "white",
        }}
      >
        <SafeAreaView className="flex-1" edges={["top", "left"]}>
          {/* Green Header Section */}
          <View className="bg-green-600 px-6 py-6">
            {/* Notification Bell */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                setTimeout(() => {
                  router.push("/screens/notifications-screen");
                });
              }}
              className="absolute top-12 right-6 z-10"
            >
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>

            {loading ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <>
                {/* Profile Section */}
                <View className="flex-row items-center mb-4">
                  {/* Avatar */}
                  {profile?.avatar ? (
                    <Image
                      source={{ uri: profile.avatar }}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <View className="w-16 h-16 bg-white rounded-full items-center justify-center">
                      <Text className="text-2xl font-bold text-green-600">
                        {profile ? getInitials(profile.name) : "R"}
                      </Text>
                    </View>
                  )}

                  {/* User Info */}
                  <View className="ml-4 flex-1">
                    <Text
                      className="text-white font-bold text-lg"
                      numberOfLines={1}
                    >
                      {profile?.name || "RUE Logistics"}
                    </Text>
                    <Text className="text-white text-xs" numberOfLines={1}>
                      {profile?.totalRides || 0} Rides
                    </Text>

                    {/* Star Rating */}
                    <View className="flex-row mt-1">
                      {profile && renderStars(profile.rating)}
                    </View>
                  </View>
                </View>

                {/* Online Status */}
                <View className="flex-row items-center">
                  <View
                    className={`w-3 h-3 rounded-full mr-2 ${
                      profile?.isOnline ? "bg-white" : "bg-gray-400"
                    }`}
                  />
                  <Text className="text-white font-semibold text-sm">
                    {profile?.isOnline ? "ONLINE!" : "OFFLINE"}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Menu Items */}
          <View className="flex-1">
            <ScrollView className="flex-1">
              <MenuItem
                icon="wallet-outline"
                label="My Wallet"
                onPress={() => handleNavigation("/screens/wallet-screen")}
              />
              <MenuItem
                icon="time-outline"
                label="History"
                onPress={() => handleNavigation("/screens/history-screen")}
              />
              <MenuItem
                icon="settings-outline"
                label="Settings"
                onPress={() => handleNavigation("/screens/settings-screen")}
              />
              <MenuItem
                icon="chatbubble-ellipses-outline"
                label="Support"
                onPress={() => handleNavigation("/screens/support-screen")}
              />
              <MenuItem
                icon="log-out-outline"
                label="Logout"
                onPress={handleLogout}
              />
            </ScrollView>

            {/* Customer Mode Button */}
            <View className="px-6 py-6">
              <TouchableOpacity
                className="bg-green-500 rounded-full py-4 items-center"
                onPress={() =>
                  handleNavigation("/screens/customer-mode-screen")
                }
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base">
                  Customer Mode
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default MenuScreen;
