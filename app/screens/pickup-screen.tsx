import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

interface PickupLocation {
  latitude: number;
  longitude: number;
  address: string;
  businessName: string;
  businessImage?: string;
}

interface RiderLocation {
  latitude: number;
  longitude: number;
}

export default function PickupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);

  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(
    null
  );
  const [pickupLocation, setPickupLocation] = useState<PickupLocation | null>(
    null
  );
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [navigationInstruction, setNavigationInstruction] = useState("");
  const [hasArrived, setHasArrived] = useState(false);
  const [distance, setDistance] = useState(0); // in meters
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializePickup();
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            setRiderLocation({ latitude, longitude });

            // Check if arrived at pickup location
            if (pickupLocation) {
              const dist = calculateDistance(
                latitude,
                longitude,
                pickupLocation.latitude,
                pickupLocation.longitude
              );
              setDistance(dist);

              // Consider arrived if within 50 meters
              if (dist <= 50 && !hasArrived) {
                setHasArrived(true);
                Alert.alert(
                  "Arrived!",
                  "You have arrived at the pickup location"
                );
              }
            }

            // Update route if needed
            if (pickupLocation && !hasArrived) {
              fetchRoute(latitude, longitude, pickupLocation);
            }
          }
        );
      } catch (error) {
        console.error("Location tracking error:", error);
      }
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [pickupLocation, hasArrived]);

  const initializePickup = async () => {
    try {
      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setRiderLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Fetch order details from API
      // Replace with your actual API endpoint
      // const response = await fetch(`YOUR_API_URL/orders/${params.orderId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const orderData = await response.json();

      // Mock pickup location data
      const pickupData: PickupLocation = {
        latitude: 6.335, // Example: Benin City coordinates
        longitude: 5.6037,
        address: "Ugbowo",
        businessName: "Nadia Bakery, Ugbowo",
        businessImage: undefined,
      };

      setPickupLocation(pickupData);

      // Get initial route
      await fetchRoute(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        pickupData
      );

      setLoading(false);
    } catch (error) {
      console.error("Error initializing pickup:", error);
      Alert.alert("Error", "Failed to load pickup details");
      setLoading(false);
    }
  };

  const fetchRoute = async (
    fromLat: number,
    fromLng: number,
    toLocation: PickupLocation
  ) => {
    try {
      // Use Google Directions API or your routing service
      // const response = await fetch(
      //   `https://maps.googleapis.com/maps/api/directions/json?origin=${fromLat},${fromLng}&destination=${toLocation.latitude},${toLocation.longitude}&key=YOUR_GOOGLE_API_KEY`
      // );
      // const data = await response.json();

      // For now, create a simple straight line
      const route = [
        { latitude: fromLat, longitude: fromLng },
        { latitude: toLocation.latitude, longitude: toLocation.longitude },
      ];

      setRouteCoordinates(route);

      // Get navigation instruction (simplified)
      const instruction = generateNavigationInstruction(
        fromLat,
        fromLng,
        toLocation.latitude,
        toLocation.longitude
      );
      setNavigationInstruction(instruction);

      // Fit map to show route
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(route, {
          edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const generateNavigationInstruction = (
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): string => {
    // Simplified navigation instruction
    const bearing = calculateBearing(fromLat, fromLng, toLat, toLng);

    if (bearing >= 315 || bearing < 45) {
      return "Head north";
    } else if (bearing >= 45 && bearing < 135) {
      return "Turn right";
    } else if (bearing >= 135 && bearing < 225) {
      return "Head south";
    } else {
      return "Turn left";
    }
  };

  const calculateBearing = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    return ((θ * 180) / Math.PI + 360) % 360;
  };

  const handleBack = () => {
    Alert.alert(
      "Cancel Pickup",
      "Are you sure you want to cancel this pickup?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="text-gray-500 mt-4">Loading pickup details...</Text>
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
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#22c55e"
            strokeWidth={4}
          />
        )}

        {/* Rider Location */}
        {riderLocation && (
          <Marker coordinate={riderLocation} anchor={{ x: 0.5, y: 0.5 }} flat>
            <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center border-4 border-white shadow-lg">
              <Ionicons name="navigate" size={20} color="#fff" />
            </View>
          </Marker>
        )}

        {/* Pickup Location */}
        {pickupLocation && (
          <Marker
            coordinate={{
              latitude: pickupLocation.latitude,
              longitude: pickupLocation.longitude,
            }}
          >
            <View className="items-center">
              <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center border-4 border-white shadow-lg">
                <Ionicons name="location" size={24} color="#fff" />
              </View>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Top Header */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={["top"]}>
        <View className="bg-white px-6 py-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-bold ml-4">Pick up</Text>
          </View>

          {/* Navigation Instruction Bar */}
          <View
            className={`flex-row items-center px-4 py-3 rounded-lg ${
              hasArrived ? "bg-green-500" : "bg-green-500"
            }`}
          >
            <Ionicons
              name={hasArrived ? "checkmark-circle" : "navigate"}
              size={24}
              color="#fff"
            />
            <Text className="text-white font-bold text-base ml-3">
              {hasArrived
                ? "ARRIVED!"
                : navigationInstruction || "Navigating to pickup"}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom Card */}
      <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl px-6 py-6 shadow-2xl">
        <View className="flex-row items-center">
          {/* Business Image */}
          {pickupLocation?.businessImage ? (
            <Image
              source={{ uri: pickupLocation.businessImage }}
              className="w-16 h-16 rounded-xl"
            />
          ) : (
            <View className="w-16 h-16 bg-gray-200 rounded-xl items-center justify-center">
              <Ionicons name="business" size={32} color="#9ca3af" />
            </View>
          )}

          {/* Business Details */}
          <View className="ml-4 flex-1">
            <Text className="text-xs text-gray-500 uppercase mb-1">
              PICK UP
            </Text>
            <Text className="text-base font-bold" numberOfLines={2}>
              {pickupLocation?.businessName || "Pickup Location"}
            </Text>
          </View>
        </View>

        {/* Distance Indicator */}
        {!hasArrived && distance > 0 && (
          <View className="mt-4 bg-gray-100 rounded-lg px-4 py-2">
            <Text className="text-sm text-gray-600 text-center">
              {distance > 1000
                ? `${(distance / 1000).toFixed(1)} km away`
                : `${Math.round(distance)} m away`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
