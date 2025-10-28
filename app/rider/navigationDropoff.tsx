import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRouter } from "expo-router";

export default function DropoffNavigation() {
  const router = useRouter();
  const pickup = { latitude: 6.347, longitude: 5.625 };
  const drop = { latitude: 6.355, longitude: 5.64 };

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          ...pickup,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker coordinate={pickup} title="Pickup" />
        <Marker coordinate={drop} title="Drop-off" />
        <Polyline coordinates={[pickup, drop]} strokeWidth={4} />
      </MapView>

      <View className="absolute bottom-10 w-full px-6">
        <TouchableOpacity
          onPress={() => router.push("/(rider)/payment")}
          className="bg-blue-600 py-4 rounded-xl"
        >
          <Text className="text-white text-center font-bold text-lg">
            Request Payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
