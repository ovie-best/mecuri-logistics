import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function PaymentScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text className="text-2xl font-bold mb-4">💰 Payment Requested</Text>
      <Text className="text-gray-600 mb-6">Awaiting confirmation...</Text>

      <TouchableOpacity
        onPress={() => router.replace("/(rider)/index")}
        className="bg-green-600 px-6 py-4 rounded-xl"
      >
        <Text className="text-white font-bold">Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}
