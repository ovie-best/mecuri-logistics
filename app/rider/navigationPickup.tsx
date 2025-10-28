import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { useRouter } from "expo-router";

export default function PickupNavigation() {
  const router = useRouter();

  const start = { latitude: 6.339, longitude: 5.62 };
  const end = { latitude: 6.347, longitude: 5.625 };

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          ...start,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={start} title="You" />
        <Marker coordinate={end} title="Pickup Location" />
        <Polyline coordinates={[start, end]} strokeWidth={4} />
      </MapView>

      <View className="absolute bottom-10 w-full px-6">
        <TouchableOpacity
          onPress={() => router.push("/(rider)/navigationDropoff")}
          className="bg-green-600 py-4 rounded-xl"
        >
          <Text className="text-white text-center font-bold text-lg">
            Arrived at Pickup
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
