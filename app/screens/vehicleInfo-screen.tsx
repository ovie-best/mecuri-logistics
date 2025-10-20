import { useRegistration } from "@/context/registration-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleInfoScreen() {
  const { setStep } = useRegistration();
  const [plateNumber, setPlateNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const router = useRouter();

  // Format Nigerian plate number (e.g., ABC123AB, ABC-123-AB, LAGOS-ABC123)
  const formatNigerianPlateNumber = (text: string) => {
    // Remove all non-alphanumeric characters except hyphens
    let cleaned = text.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase();

    // Nigerian plate number patterns:
    // 1. Old format: ABC123AB (7 characters)
    // 2. New format: ABC-123-AB (9 characters with hyphens)
    // 3. State format: LAGOS-ABC123 (variable length)

    // Auto-insert hyphens for new format if typing without them
    if (cleaned.length > 3 && cleaned.length <= 6 && !cleaned.includes("-")) {
      cleaned = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
    }
    if (cleaned.length > 7 && !cleaned.slice(4).includes("-")) {
      cleaned = cleaned.slice(0, 7) + "-" + cleaned.slice(7);
    }

    setPlateNumber(cleaned);
  };

  const validatePlateNumber = (plate: string) => {
    if (!plate) return false;

    // Remove hyphens for validation
    const cleanPlate = plate.replace(/-/g, "");

    // Basic validation for Nigerian plate numbers
    // Should contain both letters and numbers, at least 6 characters
    if (cleanPlate.length < 6) return false;

    const hasLetters = /[A-Z]/.test(cleanPlate);
    const hasNumbers = /[0-9]/.test(cleanPlate);

    return hasLetters && hasNumbers;
  };

  const confirm = () => {
    // Validate required fields
    if (!plateNumber || !brand || !color) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Validate plate number format
    if (!validatePlateNumber(plateNumber)) {
      Alert.alert(
        "Error",
        "Please enter a valid Nigerian plate number format\n\nExamples:\n• ABC123AB\n• ABC-123-AB\n• LAGOS-ABC123"
      );
      return;
    }

    setStep("vehicleInfo", true);
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
            Vehicle Info
          </Text>
        </View>

        <View className="space-y-5">
          {/* Plate Number */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Plate Number
            </Text>
            <TextInput
              placeholder="e.g., AKD-626-DX"
              value={plateNumber}
              onChangeText={formatNigerianPlateNumber}
              className="border border-gray-300 p-4 rounded-xl text-lg font-mono"
              autoCapitalize="characters"
              maxLength={15}
            />
          </View>

          {/* Brand of Vehicle/Elite */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Brand of Vehicle/Elite
            </Text>
            <TextInput
              placeholder="Enter vehicle brand (e.g., Toyota, Honda)"
              value={brand}
              onChangeText={setBrand}
              className="border border-gray-300 p-4 rounded-xl"
              autoCapitalize="words"
            />
          </View>

          {/* Color */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Colour
            </Text>
            <TextInput
              placeholder="Enter vehicle color"
              value={color}
              onChangeText={setColor}
              className="border border-gray-300 p-4 rounded-xl"
              autoCapitalize="words"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={confirm}
          className="bg-green-500 py-4 rounded-3xl items-center mt-8"
        >
          <Text className="text-white font-semibold text-lg">Confirm</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
