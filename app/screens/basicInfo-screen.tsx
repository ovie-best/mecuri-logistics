import { useRegistration } from "@/context/registration-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BasicInfoScreen() {
  const { setStep } = useRegistration();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
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
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
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
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert("Upload Photo", "Choose an option", [
      {
        text: "Choose from Gallery",
        onPress: pickImage,
      },
      {
        text: "Take Photo",
        onPress: takePhoto,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const confirm = () => {
    if (!name || !companyName || !dateOfBirth) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!photo) {
      Alert.alert("Error", "Please upload a photo");
      return;
    }

    // Normally validate/save
    setStep("basicInfo", true);
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
          <Text className="text-xl text-center font-bold mb-4">Basic Info</Text>
        </View>

        {/* Photo Upload Section */}
        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={showImagePickerOptions}
            className="w-72 h-72 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 items-center justify-center mb-2"
          >
            {photo ? (
              <Image
                source={{ uri: photo }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Ionicons name="camera" size={72} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <Text className="text-gray-600">Upload Photo</Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            className="border border-gray-300 p-4 rounded-xl mb-5"
          />
          <TextInput
            placeholder="Company Name"
            value={companyName}
            onChangeText={setCompanyName}
            className="border border-gray-300 p-4 rounded-xl mb-5"
          />

          {/* Date of Birth Field with Date Picker */}
          <TouchableOpacity
            onPress={showDatepicker}
            className="border border-gray-300 p-4 rounded-xl justify-center"
          >
            <Text className={dateOfBirth ? "text-black" : "text-gray-400"}>
              {dateOfBirth ? formatDate(dateOfBirth) : "Date of Birth"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Confirm Button */}
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
