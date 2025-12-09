import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface Address {
  street: string;
  city: string;
  state: string;
  landmark?: string;
}

interface SavedLocation {
  id: string;
  name: string;
  address: Address;
  type: "home" | "work" | "other";
}

// Mock saved locations
const MOCK_SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: "1",
    name: "Home",
    address: {
      street: "14 Benin-Ore Express",
      city: "Benin City",
      state: "Edo State",
      landmark: "Near First Bank",
    },
    type: "home",
  },
  {
    id: "2",
    name: "Office",
    address: {
      street: "45 Akpakpava Road",
      city: "Benin City",
      state: "Edo State",
      landmark: "Opposite NNPC Mega Station",
    },
    type: "work",
  },
];

export default function AddressSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const addressType = params.type as "pickup" | "dropoff";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<Address | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    landmark: "",
  });
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(
    MOCK_SAVED_LOCATIONS
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  // Load current location on mount
  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      // Simulate fetching current location
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock current location - replace with actual geolocation API
      const mockCurrentLocation: Address = {
        street: "New Lagos Road, off Uselu",
        city: "Benin City",
        state: "Edo State",
      };
      
      setCurrentLocation(mockCurrentLocation);
    } catch (error) {
      console.error("Failed to get current location:", error);
      Alert.alert("Location Error", "Unable to fetch current location");
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const handleSelectCurrentLocation = useCallback(() => {
    if (!currentLocation) {
      Alert.alert("Error", "Current location not available");
      return;
    }

    navigateBackWithAddress(currentLocation);
  }, [currentLocation]);

  const handleSelectSavedLocation = useCallback((location: SavedLocation) => {
    navigateBackWithAddress(location.address);
  }, []);

  const handleManualAddressSubmit = useCallback(() => {
    if (!destinationAddress.street || !destinationAddress.city || !destinationAddress.state) {
      Alert.alert("Incomplete Address", "Please fill in all required fields");
      return;
    }

    navigateBackWithAddress(destinationAddress);
  }, [destinationAddress]);

  const navigateBackWithAddress = useCallback(
    (address: Address) => {
      router.push({
        pathname: "/screens/delivery-information-screen",
        params: {
          selectedAddress: JSON.stringify(address),
          addressType: addressType,
        },
      });
    },
    [router, addressType]
  );

  const filteredLocations = savedLocations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.street.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold ml-4">
            {addressType === "pickup" ? "Select Pickup Location" : "Select Destination"}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Search for location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Current Location */}
        {addressType === "pickup" && (
          <View className="px-6 py-4 border-b border-gray-100">
            <Text className="text-xs font-semibold text-gray-500 mb-3 uppercase">
              Your Location
            </Text>
            <TouchableOpacity
              className="flex-row items-start py-2"
              onPress={handleSelectCurrentLocation}
              disabled={isLoadingLocation || !currentLocation}
            >
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                {isLoadingLocation ? (
                  <ActivityIndicator size="small" color="#22c55e" />
                ) : (
                  <Ionicons name="location" size={20} color="#22c55e" />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-base mb-1">
                  Use Current Location
                </Text>
                {currentLocation ? (
                  <Text className="text-sm text-gray-600">
                    {currentLocation.street}
                  </Text>
                ) : (
                  <Text className="text-sm text-gray-400">
                    Loading location...
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Saved Locations */}
        {!showManualInput && filteredLocations.length > 0 && (
          <View className="px-6 py-4 border-b border-gray-100">
            <Text className="text-xs font-semibold text-gray-500 mb-3 uppercase">
              Saved Locations
            </Text>
            {filteredLocations.map((location) => (
              <SavedLocationItem
                key={location.id}
                location={location}
                onPress={() => handleSelectSavedLocation(location)}
              />
            ))}
          </View>
        )}

        {/* Manual Address Input */}
        <View className="px-6 py-4">
          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() => setShowManualInput(!showManualInput)}
          >
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="create-outline" size={20} color="#3b82f6" />
            </View>
            <Text className="font-semibold text-base flex-1">
              {showManualInput ? "Hide Manual Input" : "Enter Address Manually"}
            </Text>
            <Ionicons
              name={showManualInput ? "chevron-up" : "chevron-down"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>

          {showManualInput && (
            <View className="mt-4">
              <ManualAddressForm
                address={destinationAddress}
                onChange={setDestinationAddress}
                onSubmit={handleManualAddressSubmit}
              />
            </View>
          )}
        </View>

        {/* Empty State */}
        {searchQuery && filteredLocations.length === 0 && !showManualInput && (
          <View className="items-center justify-center py-12 px-6">
            <Ionicons name="search-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-4">
              No locations found for "{searchQuery}"
            </Text>
            <TouchableOpacity
              className="mt-4 bg-blue-500 px-6 py-3 rounded-full"
              onPress={() => setShowManualInput(true)}
            >
              <Text className="text-white font-semibold">
                Enter Address Manually
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-components
interface SavedLocationItemProps {
  location: SavedLocation;
  onPress: () => void;
}

function SavedLocationItem({ location, onPress }: SavedLocationItemProps) {
  const getIconName = (type: string) => {
    switch (type) {
      case "home":
        return "home";
      case "work":
        return "briefcase";
      default:
        return "location";
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-start py-3 border-b border-gray-50"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
        <Ionicons name={getIconName(location.type)} size={18} color="#6b7280" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-base mb-1">{location.name}</Text>
        <Text className="text-sm text-gray-600 mb-0.5">
          {location.address.street}
        </Text>
        <Text className="text-xs text-gray-500">
          {location.address.city}, {location.address.state}
        </Text>
        {location.address.landmark && (
          <Text className="text-xs text-gray-400 mt-1">
            Near {location.address.landmark}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );
}

interface ManualAddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  onSubmit: () => void;
}

function ManualAddressForm({
  address,
  onChange,
  onSubmit,
}: ManualAddressFormProps) {
  return (
    <View>
      <View className="mb-4">
        <Text className="text-sm font-semibold mb-2 text-gray-700">
          Street Address *
        </Text>
        <TextInput
          className="bg-gray-100 rounded-xl px-4 py-3 text-base"
          placeholder="Enter street address"
          value={address.street}
          onChangeText={(text) => onChange({ ...address, street: text })}
        />
      </View>

      <View className="flex-row mb-4">
        <View className="flex-1 mr-2">
          <Text className="text-sm font-semibold mb-2 text-gray-700">
            City *
          </Text>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base"
            placeholder="City"
            value={address.city}
            onChangeText={(text) => onChange({ ...address, city: text })}
          />
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-sm font-semibold mb-2 text-gray-700">
            State *
          </Text>
          <TextInput
            className="bg-gray-100 rounded-xl px-4 py-3 text-base"
            placeholder="State"
            value={address.state}
            onChangeText={(text) => onChange({ ...address, state: text })}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-semibold mb-2 text-gray-700">
          Landmark (Optional)
        </Text>
        <TextInput
          className="bg-gray-100 rounded-xl px-4 py-3 text-base"
          placeholder="Nearby landmark"
          value={address.landmark}
          onChangeText={(text) => onChange({ ...address, landmark: text })}
        />
      </View>

      <TouchableOpacity
        className="bg-green-500 rounded-full py-4 items-center mt-2"
        onPress={onSubmit}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-base">Confirm Address</Text>
      </TouchableOpacity>
    </View>
  );
}