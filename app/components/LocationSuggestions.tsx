import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  View,
} from "react-native";
import nominatimService, {
  LocationSuggestion,
} from "../../services/nominatimService";

interface LocationSuggestionsProps {
  searchInput: string;
  onSelectLocation: (suggestion: LocationSuggestion) => void;
  onLocationSelected?: () => void;
  isVisible: boolean;
}

export const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({
  searchInput,
  onSelectLocation,
  onLocationSelected,
  isVisible,
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible || !searchInput.trim()) {
      setSuggestions([]);
      setError(null);
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
          setError("No locations found. Try searching with a different name.");
        }
      } catch (err: any) {
        if (err.code !== "ECONNABORTED" && err.name !== "CanceledError") {
          setError(
            "Unable to search locations. Check your internet connection."
          );
        }
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timer);
  }, [searchInput, isVisible]);

  const handleSelectSuggestion = async (suggestion: LocationSuggestion) => {
    try {
      setIsLoading(true);

      // Validate coordinates
      if (suggestion.latitude && suggestion.longitude) {
        const enrichedSuggestion: LocationSuggestion = {
          ...suggestion,
          latitude: suggestion.latitude,
          longitude: suggestion.longitude,
          displayName: suggestion.displayName || suggestion.description,
        };

        onSelectLocation(enrichedSuggestion);
        onLocationSelected?.();
        Keyboard.dismiss();
        return;
      }

      // Otherwise fetch details to get coordinates
      try {
        const placeDetails = await nominatimService.getPlaceDetails(
          suggestion.placeId
        );

        const enrichedSuggestion: LocationSuggestion = {
          ...suggestion,
          latitude: placeDetails.latitude,
          longitude: placeDetails.longitude,
          displayName: placeDetails.displayName || placeDetails.address,
        };

        onSelectLocation(enrichedSuggestion);
        onLocationSelected?.();
        Keyboard.dismiss();
      } catch (detailError) {
        setError("Failed to get location details. Please try again.");
      }
    } catch (err: any) {
      setError("Failed to select location. Please try again.");
      console.error("Error selecting location:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (
    !isVisible ||
    (!suggestions.length && !isLoading && !searchInput.trim())
  ) {
    return null;
  }

  return (
    <View className="flex-1 bg-white">
      {isLoading && searchInput.trim() && (
        <View className="flex-row items-center px-4 py-3 bg-blue-50 gap-2">
          <ActivityIndicator size="small" color="#10b981" />
          <Text className="text-gray-600 text-sm flex-1">
            Searching locations...
          </Text>
        </View>
      )}

      {error && (
        <View className="px-4 py-3 bg-red-50 flex-row items-center gap-2">
          <Ionicons name="alert-circle" size={18} color="#ef4444" />
          <Text className="text-red-700 text-sm flex-1">{error}</Text>
        </View>
      )}

      <FlatList
        scrollEnabled
        data={suggestions}
        keyExtractor={(item, index) => `${item.placeId}-${index}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectSuggestion(item)}
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
                Try searching with a different location name
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default LocationSuggestions;
