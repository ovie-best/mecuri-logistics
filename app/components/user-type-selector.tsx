import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserTypeSelectorProps {
  title: string; // "Sign up as:" or "Login as:"
  onMerchantPress: () => void;
  onCustomerPress: () => void;
}

export default function UserTypeSelector({
  title,
  onMerchantPress,
  onCustomerPress,
}: UserTypeSelectorProps) {
  return (
    <View className="bg-green-500 rounded-t-3xl px-8 py-8">
      <SafeAreaView edges={["bottom"]}>
        <Text className="text-xl font-bold text-black text-center mb-6">
          {title}
        </Text>

        <TouchableOpacity
          className="bg-white rounded-full py-4 items-center mb-4"
          onPress={onMerchantPress}
          activeOpacity={0.8}
        >
          <Text className="text-black font-bold text-lg">Merchant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-full py-4 items-center"
          onPress={onCustomerPress}
          activeOpacity={0.8}
        >
          <Text className="text-black font-bold text-lg">Customer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
