import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const amount = params.amount ? parseFloat(params.amount as string) : 0;

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setExpiryDate(formatted);
  };

  const validateCard = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      Alert.alert("Error", "Please enter a valid 16-digit card number");
      return false;
    }
    if (!cardHolder) {
      Alert.alert("Error", "Please enter card holder name");
      return false;
    }
    if (!expiryDate || expiryDate.length !== 5) {
      Alert.alert("Error", "Please enter expiry date (MM/YY)");
      return false;
    }
    if (!cvv || cvv.length < 3) {
      Alert.alert("Error", "Please enter valid CVV");
      return false;
    }
    return true;
  };

  const handleAddCard = async () => {
    if (!validateCard()) return;

    setLoading(true);
    try {
      const [month, year] = expiryDate.split("/");

      // Replace with your actual payment gateway API (Paystack, Flutterwave, etc.)
      // const response = await fetch('YOUR_API_URL/payment/add-card', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({
      //     cardNumber: cardNumber.replace(/\s/g, ''),
      //     cardHolder,
      //     expiryMonth: month,
      //     expiryYear: year,
      //     cvv,
      //     saveCard,
      //     amount,
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Success", "Card added successfully", [
        {
          text: "OK",
          onPress: () => {
            // Navigate back to payment method screen
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Add card error:", error);
      Alert.alert("Error", "Failed to add card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Fund wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Card Preview */}
        <View className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-6">
          <View className="flex-row justify-between items-start mb-8">
            <Ionicons name="card" size={32} color="#fff" />
            <Text className="text-white text-sm">
              {amount > 0 ? `₦${amount.toLocaleString()}` : ""}
            </Text>
          </View>
          <Text className="text-white text-xl tracking-wider mb-4">
            {cardNumber || "•••• •••• •••• ••••"}
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-white text-xs opacity-70 mb-1">
                CARD HOLDER
              </Text>
              <Text className="text-white font-medium">
                {cardHolder || "NAME"}
              </Text>
            </View>
            <View>
              <Text className="text-white text-xs opacity-70 mb-1">
                EXPIRES
              </Text>
              <Text className="text-white font-medium">
                {expiryDate || "MM/YY"}
              </Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Card Number */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Card number
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3 text-base"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="number-pad"
              maxLength={19}
            />
          </View>

          {/* Card Holder */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Card holder
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3 text-base"
              placeholder="John Doe"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="words"
            />
          </View>

          {/* Expiry and CVV */}
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Expiry date
              </Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                CVV
              </Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          {/* Save Card Toggle */}
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-base">Save card details</Text>
            <Switch
              value={saveCard}
              onValueChange={setSaveCard}
              trackColor={{ false: "#d1d5db", true: "#86efac" }}
              thumbColor={saveCard ? "#22c55e" : "#f3f4f6"}
            />
          </View>
        </View>
      </ScrollView>

      {/* Add Card Button */}
      <View className="px-6 pb-8 pt-4 border-t border-gray-100">
        <TouchableOpacity
          className="bg-green-500 rounded-full py-4 items-center"
          onPress={handleAddCard}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Fund Wallet
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
