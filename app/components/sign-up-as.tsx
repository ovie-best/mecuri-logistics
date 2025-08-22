import { Text, TouchableOpacity, View } from "react-native";

export function SignUpAs() {
  return (
    <View className="flex-1">
      <Text className="text-center text-xl font-bold text-black mb-4">
        Sign Up as:
      </Text>
      <View className="items-center">
        <TouchableOpacity className="bg-white rounded-full py-4 mb-4 w-60">
          <Text className="text-black text-center font-bold ">Merchant</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white rounded-full py-4 mb-4 w-60 ">
          <Text className="text-black text-center font-bold">Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
