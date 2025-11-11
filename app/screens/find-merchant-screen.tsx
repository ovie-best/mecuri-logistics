import { Ionicons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useDelivery } from "../../context/delivery-context";

// Types
interface Courier {
  id: string;
  name: string;
  rating: number;
  phone: string;
  avatar: string;
  amount: number;
  pickupAddress: string;
  dropoffAddress: string;
}

type RootDrawerParamList = {
  "customer-home": undefined;
  "find-merchant": undefined;
  calling: { courier: Courier };
  chat: { courier: Courier };
};

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const FindMerchantScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { currentLocation, dropOffLocation } = useDelivery();
  const mapRef = useRef<MapView>(null);

  const [searchState, setSearchState] = useState<"searching" | "found">(
    "searching"
  );
  const [showMerchantModal, setShowMerchantModal] = useState<boolean>(false);
  const [arrivalTime, setArrivalTime] = useState<number>(4);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Mock courier data
  const mockCourier: Courier = {
    id: "1",
    name: "RUE LOGISTICS",
    rating: 5.0,
    phone: "08036424208",
    avatar: "https://via.placeholder.com/150",
    amount: 2500,
    pickupAddress: "Uniben ICT Centre, Benin City, Nigeria",
    dropoffAddress: "Uniben Guest House, Benin City, Nigeria",
  };

  useEffect(() => {
    // Simulate searching for merchant
    const searchTimer = setTimeout(() => {
      setSearchState("found");
      setShowMerchantModal(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }, 3000);

    // Animate progress bar
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();

    return () => clearTimeout(searchTimer);
  }, []);

  useEffect(() => {
    if (searchState === "found") {
      const countdownTimer = setInterval(() => {
        setArrivalTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 60000); // Update every minute

      return () => clearInterval(countdownTimer);
    }
  }, [searchState]);

  const handleCall = (): void => {
    setShowMerchantModal(false);
    setTimeout(() => {
      navigation.navigate("calling", { courier: mockCourier });
    }, 300);
  };

  const handleMessage = (): void => {
    setShowMerchantModal(false);
    setTimeout(() => {
      navigation.navigate("chat", { courier: mockCourier });
    }, 300);
  };

  const handleDirectCall = (): void => {
    Linking.openURL(`tel:${mockCourier.phone}`);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const openDrawer = (): void => {
    navigation.openDrawer();
  };

  if (!currentLocation) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        initialRegion={currentLocation as Region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="Your Location"
          pinColor="#ef4444"
        />

        {/* Drop-off Location Marker */}
        {dropOffLocation && (
          <Marker
            coordinate={{
              latitude: dropOffLocation.latitude,
              longitude: dropOffLocation.longitude,
            }}
            title="Drop-off Location"
            pinColor="#22c55e"
          />
        )}
      </MapView>

      {/* Top Bar */}
      <View className="absolute top-0 left-0 right-0 pt-12 pb-4 px-4 flex-row items-center justify-between bg-transparent">
        <TouchableOpacity
          onPress={openDrawer}
          className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>

        {searchState === "found" && (
          <View className="bg-white px-4 py-2 rounded-full shadow-lg">
            <Text className="text-green-600 font-semibold">
              Merchant arriving in {arrivalTime}mins!
            </Text>
          </View>
        )}

        <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg">
          <Ionicons name="notifications" size={24} color="#22c55e" />
        </View>
      </View>

      {/* Searching Overlay */}
      {searchState === "searching" && (
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl px-6 py-8 shadow-2xl">
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
              <View className="w-20 h-20 bg-white rounded-full items-center justify-center">
                <Ionicons name="bicycle" size={40} color="#22c55e" />
              </View>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Looking for the nearest merchant...
            </Text>
            <Text className="text-sm text-green-600 font-medium">
              Interstate Delivery
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <Animated.View
              style={{ width: progressWidth }}
              className="h-full bg-green-500"
            />
          </View>
        </View>
      )}

      {/* Merchant Found Modal */}
      <Modal
        visible={showMerchantModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowMerchantModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }] }}
            className="bg-white rounded-3xl w-full overflow-hidden"
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowMerchantModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full items-center justify-center z-10"
            >
              <Ionicons name="close" size={20} color="#000" />
            </TouchableOpacity>

            {/* Success Header */}
            <View className="bg-green-50 px-6 pt-8 pb-4">
              <View className="items-center">
                <View className="w-24 h-24 bg-orange-300 rounded-full items-center justify-center mb-4">
                  <Text className="text-white text-3xl">👤</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800 mb-1">
                  MERCHANT FOUND!
                </Text>
                <Text className="text-sm text-green-600 font-medium">
                  Interstate Delivery
                </Text>
              </View>
            </View>

            {/* Courier Info */}
            <View className="px-6 py-6">
              <View className="items-center mb-6">
                <View className="flex-row items-center mb-2">
                  <Text className="text-xl font-bold text-gray-800 mr-2">
                    {mockCourier.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#fbbf24" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {mockCourier.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-500">
                  {mockCourier.phone}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row items-center justify-center mb-6 space-x-4">
                <TouchableOpacity
                  onPress={handleCall}
                  className="w-16 h-16 bg-green-500 rounded-full items-center justify-center"
                >
                  <Ionicons name="call" size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleMessage}
                  className="w-16 h-16 bg-green-500 rounded-full items-center justify-center"
                >
                  <Ionicons name="chatbubble" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Amount */}
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-center text-sm text-gray-600 mb-1">
                  Amount:
                </Text>
                <Text className="text-center text-2xl font-bold text-green-600">
                  ₦{mockCourier.amount.toLocaleString()}
                </Text>
              </View>

              {/* Addresses */}
              <View className="space-y-3">
                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-3 mt-1">
                    <Ionicons name="location" size={14} color="#fff" />
                  </View>
                  <Text className="flex-1 text-sm text-gray-700">
                    {mockCourier.pickupAddress}
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center mr-3 mt-1">
                    <Ionicons name="location" size={14} color="#fff" />
                  </View>
                  <Text className="flex-1 text-sm text-gray-700">
                    {mockCourier.dropoffAddress}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default FindMerchantScreen;
