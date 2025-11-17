import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import nominatimService, {
  LocationSuggestion,
} from "../../services/nominatimService";

interface PickupAddressModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (location: LocationSuggestion) => void;
  currentPickupAddress?: string;
}

export const PickupAddressModal: React.FC<PickupAddressModalProps> = ({
  visible,
  onClose,
  onLocationSelected,
  currentPickupAddress,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<TextInput>(null);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchInput("");
      setSuggestions([]);
      setError(null);
    }
  }, [visible]);

  // Fetch suggestions as user types
  useEffect(() => {
    if (!visible || !searchInput.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results =
          await nominatimService.getAddressPredictions(searchInput);
        setSuggestions(results);

        if (results.length === 0 && searchInput.trim().length > 2) {
          setError("No pickup locations found. Try another search.");
        }
      } catch (err: any) {
        if (err.code !== "ECONNABORTED" && err.name !== "CanceledError") {
          setError("Unable to search locations. Check your internet.");
        }
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timer);
  }, [searchInput, visible]);

  const handleSelectAddress = async (suggestion: LocationSuggestion) => {
    try {
      setIsLoading(true);

      // If we already have coordinates, use them directly
      if (suggestion.latitude && suggestion.longitude) {
        const enrichedSuggestion: LocationSuggestion = {
          ...suggestion,
          latitude: suggestion.latitude,
          longitude: suggestion.longitude,
        };

        onLocationSelected(enrichedSuggestion);
        onClose();
        return;
      }

      // Otherwise fetch details to get coordinates
      const placeDetails = await nominatimService.getPlaceDetails(
        suggestion.placeId
      );

      const enrichedSuggestion: LocationSuggestion = {
        ...suggestion,
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
      };

      onLocationSelected(enrichedSuggestion);
      onClose();
    } catch (err: any) {
      setError("Failed to select location. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">
              Pickup Address
            </Text>
            <Text className="text-gray-600 text-xs mt-1">
              Where should we pick up from?
            </Text>
          </View>
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
              placeholder="Search pickup location"
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
                onPress={() => setSearchInput("")}
                className="p-2 active:opacity-60"
              >
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Loading State */}
        {isLoading && searchInput.trim() && (
          <View className="flex-row items-center px-4 py-3 bg-blue-50 gap-2">
            <ActivityIndicator size="small" color="#10b981" />
            <Text className="text-gray-600 text-sm flex-1">
              Searching locations...
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className="px-4 py-3 bg-red-50 flex-row items-center gap-2">
            <Ionicons name="alert-circle" size={18} color="#ef4444" />
            <Text className="text-red-700 text-sm flex-1">{error}</Text>
          </View>
        )}

        {/* Suggestions List */}
        <FlatList
          scrollEnabled
          data={suggestions}
          keyExtractor={(item, index) => `${item.placeId}-${index}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelectAddress(item)}
              className="border-b border-gray-100 px-4 py-4 active:bg-gray-50"
              disabled={isLoading}
            >
              <View className="flex-row items-start gap-3">
                <View className="mt-1">
                  <Ionicons name="location" size={18} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 text-base">
                    {item.mainText}
                  </Text>
                  {item.secondaryText && (
                    <Text className="text-gray-600 text-sm mt-1">
                      {item.secondaryText}
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            !isLoading && searchInput.trim() ? (
              <View className="px-4 py-8 items-center">
                <Ionicons name="location-outline" size={32} color="#d1d5db" />
                <Text className="text-gray-600 mt-3 font-semibold">
                  No locations found
                </Text>
                <Text className="text-gray-500 text-sm mt-1 text-center">
                  Try searching with a different name
                </Text>
              </View>
            ) : null
          }
        />

        {/* Empty State */}
        {searchInput.trim() === "" && (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="location-outline" size={48} color="#d1d5db" />
            <Text className="text-lg font-semibold text-gray-900 mt-4">
              Search for pickup location
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Enter your pickup address, street name, or a landmark
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};
