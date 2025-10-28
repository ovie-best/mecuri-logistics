import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

interface RiderLocation {
  latitude: number;
  longitude: number;
  heading?: number;
}

interface RiderStatus {
  isOnline: boolean;
  isOnTrip: boolean;
  currentOrder?: any;
}

export default function RiderMapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<RiderLocation | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [riderStatus, setRiderStatus] = useState<RiderStatus>({
    isOnline: true,
    isOnTrip: false,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    if (isOnline) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    async function startLocationTracking() {
      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 10, // Update every 10 meters
          },
          (newLocation) => {
            const { latitude, longitude, heading } = newLocation.coords;
            setLocation({
              latitude,
              longitude,
              heading: heading || 0,
            });

            // Send location to backend
            updateLocationOnServer(latitude, longitude, heading || 0);

            // Center map on rider location
            if (mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000
              );
            }
          }
        );
      } catch (error) {
        console.error("Location tracking error:", error);
      }
    }

    function stopLocationTracking() {
      if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
      }
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isOnline]);

  const requestLocationPermission = async () => {
    try {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required to work as a rider. Please enable it in settings.",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      // Request background location for continuous tracking
      if (Platform.OS === "android" || Platform.OS === "ios") {
        await Location.requestBackgroundPermissionsAsync();
      }

      // Get initial location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        heading: currentLocation.coords.heading || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error("Permission error:", error);
      Alert.alert("Error", "Failed to get location permission");
      setLoading(false);
    }
  };

  const updateLocationOnServer = async (
    latitude: number,
    longitude: number,
    heading: number
  ) => {
    try {
      // Replace with your actual API endpoint
      // await fetch('YOUR_API_URL/rider/location', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({
      //     latitude,
      //     longitude,
      //     heading,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const handleToggleOnline = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    try {
      // Update online status on server
      // await fetch('YOUR_API_URL/rider/status', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({ isOnline: newStatus }),
      // });

      if (newStatus) {
        Alert.alert("You're Online", "You can now receive delivery requests");
      } else {
        Alert.alert(
          "You're Offline",
          "You won't receive any delivery requests"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update status");
      setIsOnline(!newStatus); // Revert on error
    }
  };

  const handleRecenterMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const handleMenuPress = () => {
    router.push("/screens/merchant-welcome-screen");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-gray-500 mt-4">Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={64} color="#d1d5db" />
          <Text className="text-gray-500 text-center mt-4">
            Unable to get your location. Please check your location settings.
          </Text>
          <TouchableOpacity
            className="bg-green-500 rounded-full py-3 px-6 mt-6"
            onPress={requestLocationPermission}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        loadingEnabled
      >
        {/* Rider Location Marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
            rotation={location.heading || 0}
          >
            <View className="items-center justify-center">
              <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center border-4 border-white shadow-lg">
                <Ionicons name="navigate" size={24} color="#fff" />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Top Header Overlay */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={["top"]}>
        <View className="flex-row items-center justify-between px-6 py-4 bg-white/95 backdrop-blur">
          {/* Menu Button */}
          <TouchableOpacity onPress={handleMenuPress}>
            <Ionicons name="menu" size={28} color="#000" />
          </TouchableOpacity>

          {/* Online Status */}
          <View className="flex-row items-center">
            <Text
              className={`font-bold text-lg mr-3 ${
                isOnline ? "text-green-500" : "text-gray-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
            <TouchableOpacity
              onPress={handleToggleOnline}
              className={`w-14 h-8 rounded-full justify-center ${
                isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full bg-white shadow-md ${
                  isOnline ? "ml-7" : "ml-1"
                }`}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Recenter Button */}
      <View className="absolute bottom-24 right-6">
        <TouchableOpacity
          onPress={handleRecenterMap}
          className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="locate" size={24} color="#22c55e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
