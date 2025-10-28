// screens/MapIdleScreen.tsx
import Slider from "@react-native-community/slider";
import React, { useEffect } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import RequestModal from "../components/request-modal";
import { mockIncomingJob, useDeliveryStore } from "../stores/DeliveryStore";

export default function MapIdleScreen({ navigation }: any) {
  const { online, setOnline, status } = useDeliveryStore();

  useEffect(() => {
    if (online && status === "IDLE") {
      // Mock: Trigger job after 5s
      const timeout = setTimeout(mockIncomingJob, 5000);
      return () => clearTimeout(timeout);
    }
  }, [online, status]);

  useEffect(() => {
    if (status === "GO_TO_PICKUP") {
      navigation.navigate("GoToPickup");
    }
  }, [status]);

  const beninCity = {
    latitude: 6.3349,
    longitude: 5.6037,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <View className="flex-row items-center justify-between px-4 pt-2">
        <TouchableOpacity className="p-2">
          <ChevronLeftIcon size={28} color="#fff" />
        </TouchableOpacity>
        <View className="flex-row items-center space-x-2">
          <Text className="text-white font-medium">Online</Text>
          <Slider
            style={{ width: 60, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={online ? 1 : 0}
            onValueChange={(v) => setOnline(v >= 0.5)}
            minimumTrackTintColor="#10B981"
            maximumTrackTintColor="#4B5563"
            thumbTintColor="#10B981"
            step={1}
          />
        </View>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        initialRegion={beninCity}
      />
      <RequestModal />
    </SafeAreaView>
  );
}
