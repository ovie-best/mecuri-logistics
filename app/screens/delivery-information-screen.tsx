import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface Address {
  street: string;
  city: string;
  state: string;
  landmark?: string;
}

interface PackageDetails {
  type: string;
  category: string;
  value: string;
}

const PACKAGE_TYPES = [
  "Envelope",
  "Small Box",
  "Medium Box",
  "Large Box",
  "Document",
  "Food",
  "Other",
];

const PACKAGE_CATEGORIES = [
  "Electronics",
  "Documents",
  "Clothing",
  "Food & Beverage",
  "Fragile Items",
  "Books",
  "Other",
];

export default function DeliveryInformationScreen() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [pickupAddress, setPickupAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    landmark: "",
  });
  const [dropoffAddress, setDropoffAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    landmark: "",
  });
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    type: "",
    category: "",
    value: "",
  });

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [isPickupConfirmed, setIsPickupConfirmed] = useState(false);
  const [isDropoffConfirmed, setIsDropoffConfirmed] = useState(false);
  const [isPackageConfirmed, setIsPackageConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const openPackageModal = () => {
    setShowPackageModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closePackageModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setShowPackageModal(false);
    });
  };

  const handleAddPackageDetails = () => {
    if (
      !packageDetails.type ||
      !packageDetails.category ||
      !packageDetails.value
    ) {
      Alert.alert("Error", "Please fill in all package details");
      return;
    }

    const value = parseFloat(packageDetails.value);
    if (isNaN(value) || value <= 0) {
      Alert.alert("Error", "Please enter a valid item value");
      return;
    }

    setIsPackageConfirmed(true);
    closePackageModal();
  };

  const handlePickupAddressPress = () => {
    router.push({
      pathname: "/screens/address-selection-screen",
      params: { type: "pickup" },
    });
  };

  const handleDropoffAddressPress = () => {
    if (!isPickupConfirmed) {
      Alert.alert("Error", "Please select pickup address first");
      return;
    }
    router.push({
      pathname: "/screens/address-selection-screen",
      params: { type: "dropoff" },
    });
  };

  const handleFindMerchant = async () => {
    if (!isPickupConfirmed || !isDropoffConfirmed || !isPackageConfirmed) {
      Alert.alert("Error", "Please complete all fields before proceeding");
      return;
    }

    setLoading(true);
    try {
      // Create delivery request
      // const response = await fetch('YOUR_API_URL/deliveries/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({
      //     pickupAddress,
      //     dropoffAddress,
      //     packageDetails,
      //   }),
      // });
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to merchant search/matching screen
      router.push("/screens/finding-merchant-screen");
    } catch (error) {
      console.error("Create delivery error:", error);
      Alert.alert("Error", "Failed to create delivery request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4">Delivery Information</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Pick-up Address */}
        <TouchableOpacity
          className={`rounded-2xl p-4 mb-4 border-2 ${
            isPickupConfirmed
              ? "border-green-500 bg-green-50"
              : "border-dashed border-blue-400 bg-blue-50"
          }`}
          onPress={handlePickupAddressPress}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-bold text-base">Pick-up Address</Text>
            {isPickupConfirmed && (
              <View className="bg-green-500 rounded-full px-3 py-1">
                <Text className="text-white text-xs font-bold">VERIFIED</Text>
              </View>
            )}
          </View>
          {isPickupConfirmed ? (
            <Text className="text-gray-600 text-sm">
              {pickupAddress.street ||
                "14 Benin-Ore Express, Benin City, Nigeria"}
            </Text>
          ) : (
            <Text className="text-gray-400 text-sm">
              Tap to add pickup address
            </Text>
          )}
          <View className="absolute top-4 right-4">
            <Ionicons
              name={isPickupConfirmed ? "checkmark-circle" : "add-circle"}
              size={24}
              color={isPickupConfirmed ? "#22c55e" : "#60a5fa"}
            />
          </View>
        </TouchableOpacity>

        {/* Drop-off Address */}
        <TouchableOpacity
          className={`rounded-2xl p-4 mb-4 ${
            isDropoffConfirmed
              ? "border-2 border-green-500 bg-green-50"
              : "bg-gray-100"
          }`}
          onPress={handleDropoffAddressPress}
          disabled={!isPickupConfirmed}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-bold text-base">Drop-off Address</Text>
            {isDropoffConfirmed && (
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            )}
          </View>
          {isDropoffConfirmed ? (
            <Text className="text-gray-600 text-sm">
              {dropoffAddress.street ||
                "14 Benin-Sapele Road, Benin City, Nigeria"}
            </Text>
          ) : (
            <Text className="text-gray-400 text-sm">
              Select pickup address first
            </Text>
          )}
        </TouchableOpacity>

        {/* Package Details */}
        <TouchableOpacity
          className={`rounded-2xl p-4 mb-4 flex-row items-center justify-between ${
            isPackageConfirmed ? "bg-green-50" : "bg-gray-100"
          }`}
          onPress={openPackageModal}
        >
          <Text className="font-bold text-base">Package Details</Text>
          <View
            className={`rounded-full px-4 py-2 ${
              isPackageConfirmed ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white text-xs font-bold">
              {isPackageConfirmed ? "ADDED" : "ADD"}
            </Text>
          </View>
        </TouchableOpacity>

        {isPackageConfirmed && (
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-sm text-gray-600 mb-1">
              <Text className="font-semibold">Type:</Text> {packageDetails.type}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              <Text className="font-semibold">Category:</Text>{" "}
              {packageDetails.category}
            </Text>
            <Text className="text-sm text-gray-600">
              <Text className="font-semibold">Value:</Text> ₦
              {packageDetails.value}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Find Merchant Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          className="bg-green-500 rounded-full py-4 items-center"
          onPress={handleFindMerchant}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Find Merchant</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Package Details Modal */}
      <Modal
        visible={showPackageModal}
        transparent={true}
        animationType="none"
        onRequestClose={closePackageModal}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-white rounded-t-3xl px-6 pt-6 pb-8"
          >
            <SafeAreaView edges={["bottom"]}>
              <Text className="text-xl font-bold text-center mb-6">
                Package Type
              </Text>

              {/* Package Type Dropdown */}
              <View className="mb-4">
                <Text className="text-sm font-semibold mb-2">Package Type</Text>
                <View className="bg-gray-100 rounded-xl">
                  <TextInput
                    className="px-4 py-3 text-base"
                    placeholder="Select package type"
                    value={packageDetails.type}
                    onFocus={() => {
                      // In production, show a proper picker/dropdown
                      Alert.alert(
                        "Select Package Type",
                        "",
                        PACKAGE_TYPES.map((type) => ({
                          text: type,
                          onPress: () =>
                            setPackageDetails({ ...packageDetails, type }),
                        }))
                      );
                    }}
                  />
                </View>
              </View>

              {/* Package Category Dropdown */}
              <View className="mb-4">
                <Text className="text-sm font-semibold mb-2">
                  Package Category
                </Text>
                <View className="bg-gray-100 rounded-xl">
                  <TextInput
                    className="px-4 py-3 text-base"
                    placeholder="Select category"
                    value={packageDetails.category}
                    onFocus={() => {
                      Alert.alert(
                        "Select Category",
                        "",
                        PACKAGE_CATEGORIES.map((category) => ({
                          text: category,
                          onPress: () =>
                            setPackageDetails({ ...packageDetails, category }),
                        }))
                      );
                    }}
                  />
                </View>
              </View>

              {/* Item Value */}
              <View className="mb-6">
                <Text className="text-sm font-semibold mb-2">Item Value</Text>
                <View className="bg-gray-100 rounded-xl flex-row items-center px-4">
                  <Text className="text-base mr-2">₦</Text>
                  <TextInput
                    className="flex-1 py-3 text-base"
                    placeholder="0"
                    value={packageDetails.value}
                    onChangeText={(text) =>
                      setPackageDetails({ ...packageDetails, value: text })
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Add Details Button */}
              <TouchableOpacity
                className="bg-green-500 rounded-full py-4 items-center"
                onPress={handleAddPackageDetails}
              >
                <Text className="text-white font-bold text-base">
                  Add details
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
