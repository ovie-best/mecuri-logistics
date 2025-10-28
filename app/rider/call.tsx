import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function CallScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <Text className="text-white text-3xl font-bold mb-4">
        📞 Calling John Doe...
      </Text>

      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-red-600 px-8 py-4 rounded-full"
      >
        <Text className="text-white font-bold text-lg">End Call</Text>
      </TouchableOpacity>
    </View>
  );
}
