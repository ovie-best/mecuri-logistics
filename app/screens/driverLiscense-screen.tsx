import { useRegistration } from "@/context/registration-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverLicenseScreen() {
  const { setStep } = useRegistration();
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [backPhoto, setBackPhoto] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async (type: "front" | "back") => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2], // Good aspect ratio for driver's license
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === "front") {
        setFrontPhoto(result.assets[0].uri);
      } else {
        setBackPhoto(result.assets[0].uri);
      }
    }
  };

  const takePhoto = async (type: "front" | "back") => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 2], // Good aspect ratio for driver's license
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === "front") {
        setFrontPhoto(result.assets[0].uri);
      } else {
        setBackPhoto(result.assets[0].uri);
      }
    }
  };

  const showImagePickerOptions = (type: "front" | "back") => {
    Alert.alert(
      `Upload ${type === "front" ? "Front" : "Back"} Page`,
      "Choose an option",
      [
        {
          text: "Choose from Gallery",
          onPress: () => pickImage(type),
        },
        {
          text: "Take Photo",
          onPress: () => takePhoto(type),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const confirm = () => {
    if (!frontPhoto || !backPhoto) {
      Alert.alert(
        "Error",
        "Please upload both front and back pages of your driver's license"
      );
      return;
    }

    setStep("driverLicense", true);
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-6">
      <SafeAreaView>
        <View className="flex-row justify-between p-6 bg-white">
          <TouchableOpacity
            onPress={() => router.push("/screens/merchant-welcome-screen")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl text-center font-bold mb-4">
            Driver License
          </Text>
        </View>

        <View className="mb-6">
          {/* Front Page Upload */}
          <View className="items-center">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Front Page
            </Text>
            <TouchableOpacity
              onPress={() => showImagePickerOptions("front")}
              className="w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center mb-2"
            >
              {frontPhoto ? (
                <Image
                  source={{ uri: frontPhoto }}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="document" size={40} color="#9CA3AF" />
                  <Ionicons
                    name="add-circle"
                    size={32}
                    color="#9CA3AF"
                    className="mt-1"
                  />
                </View>
              )}
            </TouchableOpacity>
            <Text className="text-xs text-gray-500 text-center">
              Tap to upload front
            </Text>
          </View>

          {/* Back Page Upload */}
          <View className="items-center mt-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Back Page
            </Text>
            <TouchableOpacity
              onPress={() => showImagePickerOptions("back")}
              className="w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center mb-2"
            >
              {backPhoto ? (
                <Image
                  source={{ uri: backPhoto }}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="document" size={40} color="#9CA3AF" />
                  <Ionicons
                    name="add-circle"
                    size={32}
                    color="#9CA3AF"
                    className="mt-1"
                  />
                </View>
              )}
            </TouchableOpacity>
            <Text className="text-xs text-gray-500 text-center">
              Tap to upload back
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="bg-blue-50 p-4 rounded-xl mb-6">
          <Text className="text-blue-800 text-sm font-medium mb-1">
            Important Instructions:
          </Text>
          <Text className="text-blue-700 text-xs">
            • Ensure both front and back pages are clearly visible{"\n"}• All
            text should be readable and not blurry{"\n"}• Capture the entire
            document without cutting off edges{"\n"}• Good lighting is
            recommended for clear photos
          </Text>
        </View>

        <TouchableOpacity
          onPress={confirm}
          className="bg-green-500 py-4 rounded-3xl items-center"
        >
          <Text className="text-white font-semibold text-lg">Confirm</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
