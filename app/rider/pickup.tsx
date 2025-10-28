import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PickupScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }}
        className="w-24 h-24 rounded-full mb-4"
      />
      <Text className="text-lg font-bold">John Doe</Text>
      <Text className="text-gray-600 mb-2">Pickup: 12A Ekenwan Road</Text>
      <Text className="font-bold text-green-600">₦1,200</Text>

      <TouchableOpacity
        onPress={() => router.push("/(rider)/navigationPickup")}
        className="bg-blue-600 px-8 py-4 mt-6 rounded-xl"
      >
        <Text className="text-white font-bold">Go to Pickup</Text>
      </TouchableOpacity>
    </View>
  );
}
