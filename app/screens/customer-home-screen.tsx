import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import nominatimService, {
  LocationSuggestion,
} from "../../services/nominatimService";
import LocationSearchModal from "../components/LocationSearchModal";
import { useLocation } from "../context/LocationContext";

// Default coordinates for Benin City, Nigeria
const DEFAULT_LOCATION = {
  latitude: 6.3356,
  longitude: 5.6037,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  color?: string;
}

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const {
    currentLocation,
    setCurrentLocation,
    dropOffLocation,
    setDropOffLocation,
    setIsLoadingCurrentLocation,
    setLocationError,
  } = useLocation();

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const initializeCurrentLocation = useCallback(async () => {
    setIsLoadingCurrentLocation(true);
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied, using default location");
        setLocationError("Location permission denied");

        // Use default location
        setCurrentLocation({
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          address: "Benin City, Nigeria",
        });
        setIsInitializing(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      try {
        const address = await nominatimService.reverseGeocode(
          latitude,
          longitude
        );
        setCurrentLocation({
          latitude,
          longitude,
          address,
        });
        console.log("✅ Current location obtained:", address);
      } catch (error) {
        // Fallback if reverse geocoding fails
        console.warn("Reverse geocoding failed:", error);
        setCurrentLocation({
          latitude,
          longitude,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        });
      }
    } catch (error: any) {
      console.error("Error getting current location:", error);
      setLocationError("Could not get your location");

      // Use default location as fallback
      setCurrentLocation({
        latitude: DEFAULT_LOCATION.latitude,
        longitude: DEFAULT_LOCATION.longitude,
        address: "Benin City, Nigeria",
      });
    } finally {
      setIsLoadingCurrentLocation(false);
      setIsInitializing(false);
    }
  }, [
    setCurrentLocation,
    setIsLoadingCurrentLocation,
    setLocationError,
    setIsInitializing,
  ]);

  const initializeApp = useCallback(async () => {
    try {
      // Initialize Nominatim cache
      await nominatimService.initializeCache();
      console.log("✅ Nominatim service initialized");

      // Initialize current location
      await initializeCurrentLocation();
    } catch (error) {
      console.error("Error initializing app:", error);
      setIsInitializing(false);
    }
  }, [initializeCurrentLocation, setIsInitializing]);

  // Initialize services and current location on component mount
  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  // Update map markers when locations change
  useEffect(() => {
    const markers: MapMarker[] = [];

    // Add current location marker
    if (currentLocation) {
      markers.push({
        id: "current",
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        title: "Your Location",
        description: currentLocation.address,
        color: "#10b981", // Green
      });
    }

    // Add drop-off location marker
    if (
      dropOffLocation &&
      dropOffLocation.latitude &&
      dropOffLocation.longitude
    ) {
      markers.push({
        id: "dropoff",
        latitude: dropOffLocation.latitude,
        longitude: dropOffLocation.longitude,
        title: dropOffLocation.mainText || "Drop-off Location",
        description: dropOffLocation.address,
        color: "#ef4444", // Red
      });
    }

    setMapMarkers(markers);

    // Animate map to show both markers if both exist
    if (markers.length === 2 && mapRef.current) {
      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          markers.map((m) => ({
            latitude: m.latitude,
            longitude: m.longitude,
          })),
          {
            edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
            animated: true,
          }
        );
      }, 500);
    }
  }, [currentLocation, dropOffLocation]);

  const handleLocationSelected = (suggestion: LocationSuggestion) => {
    if (!suggestion.latitude || !suggestion.longitude) {
      console.warn("Selected location missing coordinates");
      return;
    }

    const dropOffData = {
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      address: suggestion.displayName || suggestion.description,
      mainText: suggestion.mainText,
      secondaryText: suggestion.secondaryText,
      placeId: suggestion.placeId,
    };

    setDropOffLocation(dropOffData);

    // Close search modal
    setSearchModalVisible(false);

    // Navigate to delivery info screen with drop-off location
    // Clear any existing navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    navigationTimeoutRef.current = setTimeout(() => {
      // Ensure currentLocation exists before navigating
      if (!currentLocation) {
        console.error("Cannot navigate: current location not available");
        return;
      }

      router.push({
        pathname: "/screens/delivery-info",
        params: {
          dropOffLatitude: suggestion.latitude!.toString(),
          dropOffLongitude: suggestion.longitude!.toString(),
          dropOffAddress:
            suggestion.displayName || suggestion.description || "",
          dropOffMainText: suggestion.mainText || "",
          pickupLatitude: currentLocation.latitude.toString(),
          pickupLongitude: currentLocation.longitude.toString(),
          pickupAddress: currentLocation.address || "",
        },
      });
    }, 300);

    // Animate map to drop-off location
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: suggestion.latitude,
          longitude: suggestion.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const handleOpenMenu = () => {
    console.log("Menu pressed");
    // Implement drawer/menu navigation here
  };

  if (isInitializing) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-gray-600 mt-4 font-semibold">
          Loading your location...
        </Text>
        <Text className="text-gray-500 text-sm mt-2">
          Using OpenStreetMap (Free)
        </Text>
      </SafeAreaView>
    );
  }

  const initialRegion = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: DEFAULT_LOCATION.latitudeDelta,
        longitudeDelta: DEFAULT_LOCATION.longitudeDelta,
      }
    : DEFAULT_LOCATION;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
      >
        {/* Map Markers */}
        {mapMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            pinColor={marker.color}
          />
        ))}
      </MapView>

      {/* Menu Button - Top Left */}
      <Pressable
        onPress={handleOpenMenu}
        className="absolute top-6 left-4 bg-white rounded-lg p-3 shadow-lg active:opacity-80"
      >
        <Ionicons name="menu" size={24} color="black" />
      </Pressable>

      {/* Search Button - Bottom Left */}
      <Pressable
        onPress={() => setSearchModalVisible(true)}
        className="absolute bottom-8 left-4 bg-white rounded-lg p-4 shadow-lg active:opacity-80"
      >
        <Ionicons name="search" size={24} color="#10b981" />
      </Pressable>

      {/* Drop-off Location Info Card - Bottom Right */}
      <View className="absolute bottom-8 right-4 bg-white rounded-lg p-4 shadow-lg max-w-xs">
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons name="location" size={16} color="#ef4444" />
          <Text className="text-xs font-semibold text-gray-600 uppercase">
            Drop-off
          </Text>
        </View>
        {dropOffLocation ? (
          <>
            <Text className="text-sm font-bold text-gray-900 mb-3 leading-tight">
              {dropOffLocation.mainText || dropOffLocation.address}
            </Text>
            <Pressable
              onPress={() => setSearchModalVisible(true)}
              className="bg-gray-100 rounded-lg py-2 px-3 items-center active:opacity-80"
            >
              <Text className="text-gray-700 font-semibold text-sm">
                Change Location
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={() => setSearchModalVisible(true)}
            className="bg-emerald-100 rounded-lg py-2 px-3 items-center active:opacity-80"
          >
            <Text className="text-emerald-700 font-semibold text-sm">
              Select Location
            </Text>
          </Pressable>
        )}
      </View>

      {/* Location Search Modal - FREE API */}
      <LocationSearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onLocationSelected={handleLocationSelected}
      />
    </SafeAreaView>
  );
}
