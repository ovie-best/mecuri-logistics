import { useRegistration } from "@/context/registration-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelfieScreen() {
  const { setStep } = useRegistration();
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  // const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async (type: "selfie" | "id") => {
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
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === "selfie") {
        setSelfiePhoto(result.assets[0].uri);
      }
      // } else {
      //   setIdPhoto(result.assets[0].uri);
      // }
    }
  };

  const takePhoto = async (type: "selfie" | "id") => {
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
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === "selfie") {
        setSelfiePhoto(result.assets[0].uri);
      }
      // } else {
      //   setIdPhoto(result.assets[0].uri);
      // }
    }
  };

  const showImagePickerOptions = (type: "selfie" | "id") => {
    Alert.alert("Upload Photo", "Choose an option", [
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
    ]);
  };

  const confirm = () => {
    if (!selfiePhoto) {
      Alert.alert("Error", "Please upload both a selfie and your ID document");
      return;
    }

    // Upload logic would go here...
    setStep("selfie", true);
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
            Selfie with ID or Driver License
          </Text>
        </View>

        {/* Selfie Upload */}
        <View className="items-center mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Selfie Photo
          </Text>

          <View>
            <TouchableOpacity
              onPress={() => showImagePickerOptions("selfie")}
              className="w-72 h-72 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center mb-2"
            >
              {selfiePhoto ? (
                <Image
                  source={{ uri: selfiePhoto }}
                  className="w-full h-full rounded-xl"
                />
              ) : (
                <Ionicons name="person" size={64} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-500 text-center">
            Tap to upload selfie
          </Text>
        </View>

        {/* Instructions */}
        <View className="bg-blue-50 p-4 rounded-xl mb-6 mt-6">
          <Text className="text-blue-800 text-sm font-medium mb-1">
            Important:
          </Text>
          <Text className="text-blue-700 text-xs">
            • Ensure your face is clearly visible in the selfie{"\n"}• The ID
            document must be valid and readable{"\n"}• Hold your ID next to your
            face for verification{"\n"}• Good lighting is recommended for both
            photos
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
