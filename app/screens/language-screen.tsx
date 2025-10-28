import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
  { code: "ig", name: "Igbo", nativeName: "Igbo" },
  { code: "ha", name: "Hausa", nativeName: "Hausa" },
  { code: "fr", name: "French", nativeName: "Français" },
];

export default function LanguageScreen() {
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [saving, setSaving] = useState(false);

  const handleLanguageSelect = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setSaving(true);

    try {
      // Replace with your actual API endpoint
      // await fetch('YOUR_API_URL/settings/language', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({ language: languageCode }),
      // });

      // Update app language/locale here
      // await i18n.changeLanguage(languageCode);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      Alert.alert("Success", "Language updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating language:", error);
      Alert.alert("Error", "Failed to update language");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Language</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <Text className="text-sm text-gray-600 mb-4">
            Select your preferred language
          </Text>

          {AVAILABLE_LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.code}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
              onPress={() => handleLanguageSelect(language.code)}
              disabled={saving}
            >
              <View className="flex-1">
                <Text className="text-base font-medium mb-1">
                  {language.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  {language.nativeName}
                </Text>
              </View>

              {saving && selectedLanguage === language.code ? (
                <ActivityIndicator size="small" color="#22c55e" />
              ) : selectedLanguage === language.code ? (
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
