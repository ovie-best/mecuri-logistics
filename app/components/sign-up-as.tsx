import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function SignUpAs() {
  const router = useRouter();
  return (
    <View className="flex-1">
      <Text className="text-center text-xl font-bold text-black mb-4">
        Sign Up as:
      </Text>
      <View className="items-center">
        <TouchableOpacity className="bg-white rounded-full py-4 mb-4 w-60">
          <Text
            className="text-black text-center font-bold "
            onPress={() => router.push("../screens/merchant-welcome-screen")}
          >
            Merchant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white rounded-full py-4 mb-4 w-60 ">
          <Text
            className="text-black text-center font-bold"
            onPress={() => router.push("../screens/rider-map-screen")}
          >
            Customer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
