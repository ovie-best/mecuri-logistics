import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { clearAuthData } from "../utils/auth-storage";

export default function SettingsScreen() {
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [appVersion] = useState("1.0.0");

  // Fetch user notification preferences
  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/settings/notifications', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();
      // setNotificationsEnabled(data.enabled);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);

    try {
      // Replace with your actual API endpoint
      // await fetch('YOUR_API_URL/settings/notifications', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({ enabled: value }),
      // });

      console.log("Notification setting updated:", value);
    } catch (error) {
      console.error("Error updating notification settings:", error);
      // Revert on error
      setNotificationsEnabled(!value);
      Alert.alert("Error", "Failed to update notification settings");
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    router.push("/screens/edit-profile-screen");
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
    router.push("/screens/change-password-screen");
  };

  const handleLanguage = () => {
    // Navigate to language selection screen
    router.push("/screens/language-screen");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // Clear auth data from local storage first
              await clearAuthData();
              console.log("Auth data cleared successfully");

              // Optionally call logout API if available
              // Note: Even if API call fails, we've already cleared local data
              try {
                // Uncomment and update with your actual logout endpoint
                // await fetch('http://YOUR_API_URL/api/users/logout/', {
                //   method: 'POST',
                //   headers: {
                //     'Authorization': `Bearer ${token}`,
                //   },
                // });
                console.log("Logout API called (if implemented)");
              } catch (apiError) {
                // Log but don't block logout if API call fails
                console.warn("Logout API call failed:", apiError);
              }

              // Navigate to login screen
              // Use replace to prevent going back to authenticated screens
              router.replace("/");
            } catch (error) {
              console.error("Logout error:", error);
              
              // Even if there's an error, try to navigate to login
              // This ensures user can always logout locally
              Alert.alert(
                "Logout",
                "Logged out locally. Some data may not have been cleared from the server.",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/"),
                  },
                ]
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const SettingItem = ({
    icon,
    iconColor,
    iconBgColor,
    label,
    onPress,
    showChevron = true,
    rightElement,
  }: {
    icon: string;
    iconColor: string;
    iconBgColor: string;
    label: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-4"
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: iconBgColor }}
      >
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text className="flex-1 text-base font-medium">{label}</Text>
      {rightElement
        ? rightElement
        : showChevron && (
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className="text-sm font-semibold text-gray-500 px-4 pt-6 pb-2">
      {title}
    </Text>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1">
        {/* Profile Section */}
        <SectionHeader title="Profile" />
        <View className="bg-white">
          <SettingItem
            icon="person-outline"
            iconColor="#000"
            iconBgColor="#f3f4f6"
            label="Edit Profile"
            onPress={handleEditProfile}
          />
          <SettingItem
            icon="key-outline"
            iconColor="#000"
            iconBgColor="#f3f4f6"
            label="Change Password"
            onPress={handleChangePassword}
          />
        </View>

        {/* Notifications Section */}
        <SectionHeader title="Notifications" />
        <View className="bg-white">
          <SettingItem
            icon="notifications"
            iconColor="#22c55e"
            iconBgColor="#dcfce7"
            label="Notifications"
            showChevron={false}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: "#d1d5db", true: "#86efac" }}
                thumbColor={notificationsEnabled ? "#22c55e" : "#f3f4f6"}
              />
            }
          />
        </View>

        {/* Regional Section */}
        <SectionHeader title="Regional" />
        <View className="bg-white">
          <SettingItem
            icon="globe-outline"
            iconColor="#000"
            iconBgColor="#f3f4f6"
            label="Language"
            onPress={handleLanguage}
          />
        </View>

        {/* Logout */}
        <View className="mt-6 bg-white">
          <SettingItem
            icon="log-out-outline"
            iconColor="#fff"
            iconBgColor="#ef4444"
            label="Logout"
            onPress={handleLogout}
          />
        </View>

        {/* App Version */}
        <View className="items-center py-8">
          <Text className="text-xs text-gray-400">App ver {appVersion}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
