import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  avatar?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/profile', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data
      const data: UserProfile = {
        name: "Osas Osarenren",
        email: "osasosarenren@gmail.com",
        phone: "+2348096669408",
        address: "Benr City, Edo State",
        city: "Lagos",
      };

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions to change your profile picture"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfile({ ...profile, avatar: result.assets[0].uri });
        // Upload image to server here
        // await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSave = async () => {
    // Validation
    if (!profile.name || !profile.email || !profile.phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      // Replace with your actual API endpoint
      // await fetch('YOUR_API_URL/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify(profile),
      // });

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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
        <Text className="text-lg font-semibold">Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1">
        {/* Profile Picture */}
        <View className="items-center py-8 bg-gradient-to-b from-green-500 to-green-600">
          <TouchableOpacity onPress={handleImagePick} className="relative">
            {profile.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                className="w-32 h-32 rounded-full"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-white items-center justify-center">
                <Ionicons name="person" size={64} color="#d1d5db" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full items-center justify-center border-4 border-white">
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text className="text-white font-semibold text-lg mt-4">
            {profile.name || "User Name"}
          </Text>
        </View>

        {/* Form Fields */}
        <View className="px-6 py-6">
          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">Name</Text>
            <TextInput
              className="bg-green-50 rounded-xl px-4 py-3 text-base"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your name"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">Email</Text>
            <TextInput
              className="bg-green-50 rounded-xl px-4 py-3 text-base"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">Phone Number</Text>
            <TextInput
              className="bg-green-50 rounded-xl px-4 py-3 text-base"
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-600 mb-2">Address</Text>
            <TextInput
              className="bg-green-50 rounded-xl px-4 py-3 text-base"
              value={profile.address}
              onChangeText={(text) => setProfile({ ...profile, address: text })}
              placeholder="Enter your address"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-2">City</Text>
            <TextInput
              className="bg-green-50 rounded-xl px-4 py-3 text-base"
              value={profile.city}
              onChangeText={(text) => setProfile({ ...profile, city: text })}
              placeholder="Enter your city"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-green-500 rounded-full py-4 items-center"
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
