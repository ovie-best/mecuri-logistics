import { Ionicons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  ListRenderItem,
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
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
  notifications: undefined;
};

type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const CustomerHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const mapRef = useRef<MapView>(null);
  const { currentLocation, updateDropOffLocation } = useDelivery();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Mock location data for Benin City
  const mockLocations: LocationData[] = [
    {
      id: "1",
      name: "Uniben, Benin City, Nigeria",
      coords: { latitude: 6.4025, longitude: 5.6177 },
    },
    {
      id: "2",
      name: "Uniben, Ekenwan Campus Benin City, Nigeria",
      coords: { latitude: 6.352, longitude: 5.5945 },
    },
    {
      id: "3",
      name: "Uniben Sport Complex, Benin City, Nigeria",
      coords: { latitude: 6.401, longitude: 5.615 },
    },
    {
      id: "4",
      name: "Uniben Ict Centre, Benin City, Nigeria",
      coords: { latitude: 6.4035, longitude: 5.619 },
    },
    {
      id: "5",
      name: "Uniben Guest House, Benin City, Nigeria",
      coords: { latitude: 6.4005, longitude: 5.6165 },
    },
    {
      id: "6",
      name: "Uniben Health Centre, Benin City, Nigeria",
      coords: { latitude: 6.4015, longitude: 5.618 },
    },
    {
      id: "7",
      name: "Ring Road, Benin City, Nigeria",
      coords: { latitude: 6.335, longitude: 5.62 },
    },
    {
      id: "8",
      name: "Uselu Market, Benin City, Nigeria",
      coords: { latitude: 6.385, longitude: 5.605 },
    },
    {
      id: "9",
      name: "Airport Road, Benin City, Nigeria",
      coords: { latitude: 6.317, longitude: 5.599 },
    },
    {
      id: "10",
      name: "Sapele Road, Benin City, Nigeria",
      coords: { latitude: 6.328, longitude: 5.635 },
    },
  ];

  useEffect(() => {
    if (modalVisible) {
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
  }, [modalVisible]);

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
    const dropOffData = {
      name: location.name,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    updateDropOffLocation(dropOffData);

    // Animate map to selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion(dropOffData, 1000);
    }

    setModalVisible(false);
    setSearchQuery("");
    setSearchResults([]);

    // Navigate to delivery info screen after a brief delay
    setTimeout(() => {
      navigation.navigate("delivery-info");
    }, 1200);
  };

  const openDrawer = (): void => {
    navigation.openDrawer();
  };

  const openNotifications = (): void => {
    navigation.navigate("notifications");
  };

  const renderLocationItem: ListRenderItem<LocationData> = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleLocationSelect(item)}
      className="py-4 border-b border-gray-100"
      activeOpacity={0.7}
    >
      <Text className="text-base text-gray-800">{item.name}</Text>
    </TouchableOpacity>
  );

  if (!currentLocation) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-4 text-gray-600">Loading map...</Text>
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
      </MapView>

      {/* Top Bar */}
      <View className="absolute top-0 left-0 right-0 pt-12 pb-4 px-4 flex-row items-center justify-between bg-transparent">
        <TouchableOpacity
          onPress={openDrawer}
          className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openNotifications}
          className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="notifications" size={24} color="#22c55e" />
          {/* Notification badge */}
          <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-8 right-6 w-14 h-14 bg-green-500 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Ionicons name="search" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Location Search Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-t-3xl"
          >
            {/* Drag Handle */}
            <View className="items-center py-3">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            {/* Modal Content */}
            <View className="px-5 pb-8">
              <Text className="text-lg font-semibold text-center mb-4">
                Select drop off location
              </Text>

              {/* Search Input */}
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
                <Ionicons name="search" size={20} color="#6b7280" />
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder="Search location..."
                  placeholderTextColor="#9ca3af"
                  className="flex-1 ml-3 text-base text-gray-800"
                  autoFocus={true}
                />
              </View>

              {/* Search Results */}
              <FlatList<LocationData>
                data={searchResults.length > 0 ? searchResults : mockLocations}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 400 }}
                keyboardShouldPersistTaps="handled"
                renderItem={renderLocationItem}
                ListEmptyComponent={
                  <View className="py-8 items-center">
                    <Text className="text-gray-500">No locations found</Text>
                  </View>
                }
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerHomeScreen;
