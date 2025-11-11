import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuScreen from "./menu-screen";

export default function RideScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-12 pb-3 bg-white shadow-sm">
        {/* Menu icon */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={28} color="black" />
        </TouchableOpacity>

        {/* Online toggle */}
        <View className="flex-row items-center space-x-2">
          <Text className="text-green-600 font-semibold text-base">Online</Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: "#d1d5db", true: "#86efac" }}
            thumbColor={isOnline ? "#22c55e" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Map section */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 6.338153,
          longitude: 5.625749,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 6.338153, longitude: 5.625749 }}
          title="Benin City"
        />
      </MapView>

      {/* Floating Search Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg"
        activeOpacity={0.8}
      >
        <Ionicons name="search-outline" size={26} color="#22c55e" />
      </TouchableOpacity>
      <MenuScreen visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
