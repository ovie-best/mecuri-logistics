import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItem,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDelivery } from "../../context/delivery-context";

const { height } = Dimensions.get("window");

// Types
interface LocationData {
  id: string;
  name: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}

type RootDrawerParamList = {
  "customer-home": undefined;
  "delivery-info": undefined;
  "find-merchant": undefined;
};

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const DeliveryInfoScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { dropOffLocation, updateDeliveryDetails, deliveryDetails } =
    useDelivery();
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [dropoffAddress, setDropoffAddress] = useState<string>(
    dropOffLocation?.name || ""
  );
  const [packageDetailsComplete, setPackageDetailsComplete] =
    useState<boolean>(false);

  // Modal states
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showPackageModal, setShowPackageModal] = useState<boolean>(false);
  const [addressType, setAddressType] = useState<"pickup" | "dropoff">(
    "pickup"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);

  // Package details states
  const [packageType, setPackageType] = useState<string>("");
  const [packageCategory, setPackageCategory] = useState<string>("");
  const [itemValue, setItemValue] = useState<string>("");
  const [showPackageTypeDropdown, setShowPackageTypeDropdown] =
    useState<boolean>(false);
  const [showPackageCategoryDropdown, setShowPackageCategoryDropdown] =
    useState<boolean>(false);

  // Mock data
  const mockLocations: LocationData[] = [
    {
      id: "1",
      name: "Uniben, Benin City, Nigeria",
      coords: { latitude: 6.4025, longitude: 5.6177 },
    },
    {
      id: "2",
      name: "Uniben Ict Centre, Benin City, Nigeria",
      coords: { latitude: 6.4035, longitude: 5.619 },
    },
    {
      id: "3",
      name: "Uniben Guest House, Benin City, Nigeria",
      coords: { latitude: 6.4005, longitude: 5.6165 },
    },
    {
      id: "4",
      name: "Ring Road, Benin City, Nigeria",
      coords: { latitude: 6.335, longitude: 5.62 },
    },
    {
      id: "5",
      name: "Airport Road, Benin City, Nigeria",
      coords: { latitude: 6.317, longitude: 5.599 },
    },
  ];

  const packageTypes = [
    "Envelope",
    "Box",
    "Document",
    "Parcel",
    "Food",
    "Electronics",
  ];
  const packageCategories = [
    "Fragile",
    "Standard",
    "Perishable",
    "Valuable",
    "Heavy",
  ];

  useEffect(() => {
    if (showAddressModal || showPackageModal) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showAddressModal, showPackageModal]);

  const handleSearch = (text: string): void => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filtered = mockLocations.filter((location) =>
        location.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleLocationSelect = (location: LocationData): void => {
    if (addressType === "pickup") {
      setPickupAddress(location.name);
    } else {
      setDropoffAddress(location.name);
    }
    setShowAddressModal(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const openAddressModal = (type: "pickup" | "dropoff"): void => {
    setAddressType(type);
    setShowAddressModal(true);
  };

  const handleAddPackageDetails = (): void => {
    if (packageType && packageCategory && itemValue) {
      updateDeliveryDetails({
        packageType,
        packageSpecify: itemValue,
        cropOfCabinet: packageCategory,
        sourcingMode: packageType,
      });
      setPackageDetailsComplete(true);
      setShowPackageModal(false);
    }
  };

  const handleFindMerchant = (): void => {
    if (pickupAddress && dropoffAddress && packageDetailsComplete) {
      navigation.navigate("find-merchant");
    }
  };

  const isFormComplete =
    pickupAddress && dropoffAddress && packageDetailsComplete;

  const renderLocationItem: ListRenderItem<LocationData> = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleLocationSelect(item)}
      className="py-4 border-b border-gray-100"
      activeOpacity={0.7}
    >
      <Text className="text-base text-gray-800">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 pt-12 pb-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Delivery Information</Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-5 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Pick-up Address */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-medium text-gray-700">
              Pick-up Address
            </Text>
            {!pickupAddress && (
              <TouchableOpacity
                onPress={() => openAddressModal("pickup")}
                className="bg-green-500 px-4 py-1.5 rounded-full"
              >
                <Text className="text-white text-sm font-semibold">+ Add</Text>
              </TouchableOpacity>
            )}
            {pickupAddress && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Icon name="checkmark" size={16} color="#fff" />
              </View>
            )}
          </View>
          {pickupAddress && (
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-sm text-gray-600">{pickupAddress}</Text>
            </View>
          )}
        </View>

        {/* Drop-off Address */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-medium text-gray-700">
              Drop-off Address
            </Text>
            {!dropoffAddress && (
              <TouchableOpacity
                onPress={() => openAddressModal("dropoff")}
                className="bg-green-500 px-4 py-1.5 rounded-full"
              >
                <Text className="text-white text-sm font-semibold">+ Add</Text>
              </TouchableOpacity>
            )}
            {dropoffAddress && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Icon name="checkmark" size={16} color="#fff" />
              </View>
            )}
          </View>
          {dropoffAddress && (
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-sm text-gray-600">{dropoffAddress}</Text>
            </View>
          )}
        </View>

        {/* Package Details */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-medium text-gray-700">
              Package Details
            </Text>
            {!packageDetailsComplete && (
              <TouchableOpacity
                onPress={() => setShowPackageModal(true)}
                className="bg-green-500 px-4 py-1.5 rounded-full"
              >
                <Text className="text-white text-sm font-semibold">+ Add</Text>
              </TouchableOpacity>
            )}
            {packageDetailsComplete && (
              <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                <Icon name="checkmark" size={16} color="#fff" />
              </View>
            )}
          </View>
          {packageDetailsComplete && (
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-sm text-gray-600">Type: {packageType}</Text>
              <Text className="text-sm text-gray-600">
                Category: {packageCategory}
              </Text>
              <Text className="text-sm text-gray-600">Value: ₦{itemValue}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Find Merchant Button */}
      <View className="px-5 pb-8 pt-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleFindMerchant}
          disabled={!isFormComplete}
          className={`py-4 rounded-full items-center ${
            isFormComplete ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white text-lg font-semibold">
            Find Merchant
          </Text>
        </TouchableOpacity>
      </View>

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowAddressModal(false)}
          />

          <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-t-3xl"
          >
            <View className="items-center py-3">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            <View className="px-5 pb-8">
              <Text className="text-lg font-semibold text-center mb-4">
                Select {addressType === "pickup" ? "pick-up" : "drop-off"}{" "}
                location
              </Text>

              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
                <Icon name="search" size={20} color="#6b7280" />
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder="Search location..."
                  placeholderTextColor="#9ca3af"
                  className="flex-1 ml-3 text-base text-gray-800"
                  autoFocus={true}
                />
              </View>

              <FlatList<LocationData>
                data={searchResults.length > 0 ? searchResults : mockLocations}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 400 }}
                keyboardShouldPersistTaps="handled"
                renderItem={renderLocationItem}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Package Details Modal */}
      <Modal
        visible={showPackageModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowPackageModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowPackageModal(false)}
          />

          <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-t-3xl"
          >
            <View className="items-center py-3">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            <View className="px-5 pb-8">
              <Text className="text-lg font-semibold mb-6">Package Type</Text>

              {/* Package Type Dropdown */}
              <TouchableOpacity
                onPress={() =>
                  setShowPackageTypeDropdown(!showPackageTypeDropdown)
                }
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-4 flex-row items-center justify-between"
              >
                <Text
                  className={packageType ? "text-gray-800" : "text-gray-400"}
                >
                  {packageType || "Select package type"}
                </Text>
                <Icon name="chevron-down" size={20} color="#6b7280" />
              </TouchableOpacity>

              {showPackageTypeDropdown && (
                <View className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
                  {packageTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setPackageType(type);
                        setShowPackageTypeDropdown(false);
                      }}
                      className="px-4 py-3 border-b border-gray-100"
                    >
                      <Text className="text-gray-800">{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text className="text-base font-semibold mb-3">
                Package Category
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setShowPackageCategoryDropdown(!showPackageCategoryDropdown)
                }
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-4 flex-row items-center justify-between"
              >
                <Text
                  className={
                    packageCategory ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {packageCategory || "Select category"}
                </Text>
                <Icon name="chevron-down" size={20} color="#6b7280" />
              </TouchableOpacity>

              {showPackageCategoryDropdown && (
                <View className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
                  {packageCategories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setPackageCategory(category);
                        setShowPackageCategoryDropdown(false);
                      }}
                      className="px-4 py-3 border-b border-gray-100"
                    >
                      <Text className="text-gray-800">{category}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text className="text-base font-semibold mb-3">Item Value</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 mb-6 flex-row items-center">
                <Text className="text-gray-800 mr-2">₦</Text>
                <TextInput
                  value={itemValue}
                  onChangeText={setItemValue}
                  placeholder="Enter amount"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  className="flex-1 text-base text-gray-800"
                />
              </View>

              <TouchableOpacity
                onPress={handleAddPackageDetails}
                disabled={!packageType || !packageCategory || !itemValue}
                className={`py-4 rounded-full items-center ${
                  packageType && packageCategory && itemValue
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                <Text className="text-white text-lg font-semibold">
                  Add details
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default DeliveryInfoScreen;
