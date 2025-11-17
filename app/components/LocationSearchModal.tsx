import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { LocationSuggestion } from "../../services/nominatimService";
import { LocationSuggestions } from "./LocationSuggestions";

interface LocationSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (location: LocationSuggestion) => void;
  title?: string;
  placeholder?: string;
}

const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  visible,
  onClose,
  onLocationSelected,
  title = "Select drop off location",
  placeholder = "Search for a location",
}) => {
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchInput("");
    }
  }, [visible]);

  const handleLocationSelected = (location: LocationSuggestion) => {
    onLocationSelected(location);
    setSearchInput("");
    onClose();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    searchInputRef.current?.focus();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="border-b border-gray-200 px-4 py-4 flex-row items-center justify-between bg-white">
          <Text className="text-lg font-bold text-gray-900">{title}</Text>
          <Pressable onPress={onClose} className="p-2 active:opacity-60">
            <Ionicons name="close" size={28} color="black" />
          </Pressable>
        </View>

        {/* Search Input */}
        <View className="px-4 py-4 bg-gray-50 border-b border-gray-200">
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
            <Ionicons name="search" size={20} color="#10b981" />
            <TextInput
              ref={searchInputRef}
              placeholder={placeholder}
              value={searchInput}
              onChangeText={setSearchInput}
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
              editable={true}
              autoFocus={true}
            />
            {searchInput.length > 0 && (
              <Pressable
                onPress={handleClearSearch}
                className="p-2 active:opacity-60"
              >
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </Pressable>
            )}
          </View>
          {/* Free API Badge */}
          <View className="flex-row items-center gap-1 mt-3 px-2">
            <Ionicons name="leaf" size={14} color="#10b981" />
            <Text className="text-xs text-emerald-700 font-semibold">
              Free OpenStreetMap data • No API key needed
            </Text>
          </View>
        </View>

        {/* Suggestions List */}
        <LocationSuggestions
          searchInput={searchInput}
          onSelectLocation={handleLocationSelected}
          isVisible={visible}
        />

        {/* Empty State - When modal is open but no search input */}
        {searchInput.trim() === "" && (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="location-outline" size={48} color="#d1d5db" />
            <Text className="text-lg font-semibold text-gray-900 mt-4">
              Start typing to search
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Enter a location name, address, or landmark to find delivery
              locations
            </Text>

            {/* Popular locations examples */}
            <View className="mt-8 w-full max-w-xs bg-gray-50 rounded-lg p-4">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Try searching for:
              </Text>
              <View className="gap-2">
                <Text className="text-sm text-gray-600">
                  • Benin City, Nigeria
                </Text>
                <Text className="text-sm text-gray-600">• Lagos, Nigeria</Text>
                <Text className="text-sm text-gray-600">• Abuja, Nigeria</Text>
                <Text className="text-sm text-gray-600">
                  • Any specific address
                </Text>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default LocationSearchModal;
