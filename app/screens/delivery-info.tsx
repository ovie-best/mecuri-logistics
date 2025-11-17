import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LocationSuggestion } from "../../services/nominatimService";
import {
  PackageDetails,
  PackageDetailsModal,
} from "../components/PackageDetailsModal";
import { PickupAddressModal } from "../components/PickupAddressModal";
import { useLocation } from "../context/LocationContext";

interface DeliveryInfoState {
  pickupAddress: string | null;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  pickupFullData?: LocationSuggestion;
  dropOffAddress: string | null;
  dropOffLatitude: number | null;
  dropOffLongitude: number | null;
  packageDetails: PackageDetails | null;
}

export default function DeliveryInfoScreen() {
  const params = useLocalSearchParams<{
    dropOffLatitude: string;
    dropOffLongitude: string;
    dropOffAddress: string;
    dropOffMainText: string;
    pickupLatitude?: string;
    pickupLongitude?: string;
    pickupAddress?: string;
  }>();

  const { setDeliveryInfo } = useLocation();

  const [state, setState] = useState<DeliveryInfoState>({
    pickupAddress: params.pickupAddress || null,
    pickupLatitude: params.pickupLatitude
      ? parseFloat(params.pickupLatitude)
      : null,
    pickupLongitude: params.pickupLongitude
      ? parseFloat(params.pickupLongitude)
      : null,
    dropOffAddress: params.dropOffAddress || null,
    dropOffLatitude: parseFloat(params.dropOffLatitude),
    dropOffLongitude: parseFloat(params.dropOffLongitude),
    packageDetails: null,
  });

  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [packageModalVisible, setPackageModalVisible] = useState(false);

  // Validation checks
  const isPickupFilled = !!state.pickupAddress;
  const isDropOffFilled = !!state.dropOffAddress;
  const isPackageFilled = !!state.packageDetails;
  const isAllComplete = isPickupFilled && isDropOffFilled && isPackageFilled;

  const handlePickupLocationSelected = (location: LocationSuggestion) => {
    setState((prev) => ({
      ...prev,
      pickupAddress:
        location.displayName || location.description || "Unknown Location",
      pickupLatitude: location.latitude || null,
      pickupLongitude: location.longitude || null,
      pickupFullData: location,
    }));
  };

  const handlePackageDetailsSaved = (details: PackageDetails) => {
    setState((prev) => ({
      ...prev,
      packageDetails: details,
    }));
  };

  const handleEditPickup = () => {
    setPickupModalVisible(true);
  };

  const handleEditPackage = () => {
    setPackageModalVisible(true);
  };

  const handleFindMerchant = async () => {
    if (!isAllComplete) {
      Alert.alert("Missing Information", "Please complete all required fields");
      return;
    }

    // Save delivery info to context
    setDeliveryInfo({
      pickupAddress: state.pickupAddress!,
      pickupLatitude: state.pickupLatitude!,
      pickupLongitude: state.pickupLongitude!,
      dropOffAddress: state.dropOffAddress!,
      dropOffLatitude: state.dropOffLatitude!,
      dropOffLongitude: state.dropOffLongitude!,
      packageDetails: state.packageDetails!,
    });

    // Navigate to find merchant screen
    router.push({
      pathname: "/screens/find-merchant",
      params: {
        pickupAddress: state.pickupAddress,
        pickupLatitude: state.pickupLatitude?.toString(),
        pickupLongitude: state.pickupLongitude?.toString(),
        dropOffAddress: state.dropOffAddress,
        dropOffLatitude: state.dropOffLatitude?.toString(),
        dropOffLongitude: state.dropOffLongitude?.toString(),
        packageType: state.packageDetails?.type,
        packageValue: state.packageDetails?.itemValue,
      },
    });
  };

  const handleChangeDropOff = () => {
    router.back();
  };

  // Address Field Component
  const AddressField = ({
    label,
    address,
    isFilled,
    onAddPress,
    onEditPress,
    isPrimary = false,
  }: {
    label: string;
    address: string | null;
    isFilled: boolean;
    onAddPress?: () => void;
    onEditPress?: () => void;
    isPrimary?: boolean;
  }) => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-semibold text-gray-700">{label}</Text>
        {isFilled ? (
          <View className="flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            {onEditPress && (
              <Pressable onPress={onEditPress} className="ml-2">
                <Text className="text-emerald-600 text-sm font-semibold">
                  Edit
                </Text>
              </Pressable>
            )}
          </View>
        ) : onAddPress ? (
          <Pressable
            onPress={onAddPress}
            className="bg-emerald-500 rounded-full px-4 py-1"
          >
            <Text className="text-white text-xs font-bold">+ Add</Text>
          </Pressable>
        ) : null}
      </View>

      <View
        className={`border rounded-lg p-4 ${
          isFilled
            ? "border-emerald-200 bg-emerald-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <Text
          className={`text-base ${
            isFilled ? "text-gray-900 font-semibold" : "text-gray-500"
          }`}
        >
          {address || `Enter ${label.toLowerCase()}`}
        </Text>
      </View>
    </View>
  );

  // Package Field Component
  const PackageField = ({
    packageDetails,
    onAddPress,
    onEditPress,
  }: {
    packageDetails: PackageDetails | null;
    onAddPress?: () => void;
    onEditPress?: () => void;
  }) => {
    const getPackageTypeLabel = (type: string) => {
      const types: { [key: string]: string } = {
        envelope: "📮 Envelope",
        small: "📦 Small Package",
        medium: "📦 Medium Package",
        large: "📦 Large Package",
        box: "📫 Box",
        document: "📄 Document",
      };
      return types[type] || type;
    };

    return (
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-semibold text-gray-700">
            Package Details
          </Text>
          {packageDetails ? (
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              {onEditPress && (
                <Pressable onPress={onEditPress} className="ml-2">
                  <Text className="text-emerald-600 text-sm font-semibold">
                    Edit
                  </Text>
                </Pressable>
              )}
            </View>
          ) : onAddPress ? (
            <Pressable
              onPress={onAddPress}
              className="bg-emerald-500 rounded-full px-4 py-1"
            >
              <Text className="text-white text-xs font-bold">+ Add</Text>
            </Pressable>
          ) : null}
        </View>

        <View
          className={`border rounded-lg p-4 ${
            packageDetails
              ? "border-emerald-200 bg-emerald-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          {packageDetails ? (
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-base text-gray-900 font-semibold">
                  {getPackageTypeLabel(packageDetails.type)}
                </Text>
              </View>
              {packageDetails.category && (
                <Text className="text-sm text-gray-600">
                  Category: {packageDetails.category}
                </Text>
              )}
              <Text className="text-sm font-semibold text-emerald-700">
                ₦{packageDetails.itemValue}
              </Text>
            </View>
          ) : (
            <Text className="text-gray-500">Add package details</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      >
        {/* Header */}
        <View className="flex-row items-center pb-4 border-b border-gray-200 mb-6">
          <Pressable onPress={() => router.back()} className="p-2 mr-2">
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">
            Delivery Information
          </Text>
        </View>

        {/* Pickup Address */}
        <AddressField
          label="Pick-up Address"
          address={state.pickupAddress}
          isFilled={isPickupFilled}
          onAddPress={() => setPickupModalVisible(true)}
          onEditPress={isPickupFilled ? handleEditPickup : undefined}
        />

        {/* Drop-off Address */}
        <AddressField
          label="Drop-off Address"
          address={state.dropOffAddress}
          isFilled={isDropOffFilled}
          onEditPress={handleChangeDropOff}
          isPrimary
        />

        {/* Package Details */}
        <PackageField
          packageDetails={state.packageDetails}
          onAddPress={() => setPackageModalVisible(true)}
          onEditPress={isPackageFilled ? handleEditPackage : undefined}
        />

        {/* Info Card */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <View className="flex-row items-start gap-3">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <View className="flex-1">
              <Text className="font-semibold text-blue-900 mb-1">
                Complete all fields
              </Text>
              <Text className="text-blue-700 text-sm">
                Add pickup address and package details to find available
                merchants
              </Text>
            </View>
          </View>
        </View>

        {/* Find Merchant Button */}
        <Pressable
          onPress={handleFindMerchant}
          disabled={!isAllComplete}
          className={`rounded-full py-4 items-center justify-center mb-4 ${
            isAllComplete ? "bg-emerald-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-lg">Find Merchant</Text>
        </Pressable>

        {/* Status Indicator */}
        <View className="flex-row items-center justify-center gap-2">
          <View
            className={`w-3 h-3 rounded-full ${isPickupFilled ? "bg-emerald-500" : "bg-gray-300"}`}
          />
          <View
            className={`w-3 h-3 rounded-full ${isDropOffFilled ? "bg-emerald-500" : "bg-gray-300"}`}
          />
          <View
            className={`w-3 h-3 rounded-full ${isPackageFilled ? "bg-emerald-500" : "bg-gray-300"}`}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <PickupAddressModal
        visible={pickupModalVisible}
        onClose={() => setPickupModalVisible(false)}
        onLocationSelected={handlePickupLocationSelected}
        currentPickupAddress={state.pickupAddress || undefined}
      />

      <PackageDetailsModal
        visible={packageModalVisible}
        onClose={() => setPackageModalVisible(false)}
        onSave={handlePackageDetailsSaved}
        initialDetails={state.packageDetails || undefined}
      />
    </SafeAreaView>
  );
}
