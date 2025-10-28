import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function FundAmountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cardId = params.cardId as string;

  const [amount, setAmount] = useState("7000.00");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState(0);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19);
  };

  const formatMonthYear = (text: string) => {
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

  const handleMonthYearChange = (text: string) => {
    const formatted = formatMonthYear(text);
    setMonthYear(formatted);
  };

  const validateInputs = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return false;
    }
    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Please enter a valid 16-digit card number");
      return false;
    }
    if (!cardHolder) {
      alert("Please enter card holder name");
      return false;
    }
    if (!monthYear || monthYear.length !== 5) {
      alert("Please enter valid expiry date (MM/YY)");
      return false;
    }
    if (!cvv || cvv.length < 3) {
      alert("Please enter valid CVV");
      return false;
    }
    return true;
  };

  const handleFundWallet = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Replace with your actual payment API
      // const response = await fetch('YOUR_API_URL/wallet/fund', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({
      //     amount: parseFloat(amount),
      //     cardNumber: cardNumber.replace(/\s/g, ''),
      //     cardHolder,
      //     expiryDate: monthYear,
      //     cvv,
      //     saveCard,
      //   }),
      // });
      // const data = await response.json();

      // Simulate API call and calculate cashback (e.g., 5%)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const calculatedCashback = parseFloat(amount) * 0.05;
      setCashbackAmount(calculatedCashback);

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Fund wallet error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate back to wallet and refresh
    router.push("/screens/wallet-screen");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Fund with Card</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-6 py-6">
        {/* Amount Display */}
        <View className="border-2 border-gray-300 rounded-2xl py-4 px-6 items-center mb-6">
          <Text className="text-3xl font-bold text-green-500">
            ₦{parseFloat(amount).toLocaleString()}
          </Text>
          <Text className="text-xs text-gray-500 mt-2">
            Only Mastercard and Visa cards are allowed
          </Text>
        </View>

        {/* Card Number */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Card Number
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
            <TextInput
              className="flex-1 text-base"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="number-pad"
              maxLength={19}
            />
            {/* Mastercard Icon */}
            <View className="flex-row">
              <View className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
              <View
                className="w-6 h-6 rounded-full bg-orange-400 opacity-80"
                style={{ marginLeft: -8 }}
              />
            </View>
          </View>
        </View>

        {/* Name on Card */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Name on Card
          </Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
            placeholder="ABRAHAM ABDUL OSAS"
            value={cardHolder}
            onChangeText={setCardHolder}
            autoCapitalize="characters"
          />
        </View>

        {/* Month/Year and CVV */}
        <View className="flex-row space-x-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Month/Year
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder="01/25"
              value={monthYear}
              onChangeText={handleMonthYearChange}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-2">CVV</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder="***"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        {/* Save Card Details */}
        <View className="flex-row items-center mb-6">
          <Switch
            value={saveCard}
            onValueChange={setSaveCard}
            trackColor={{ false: "#d1d5db", true: "#22c55e" }}
            thumbColor="#fff"
          />
          <Text className="text-sm ml-2">Save Card Details</Text>
        </View>

        {/* Fund Wallet Button */}
        <TouchableOpacity
          className="bg-green-500 rounded-full py-4 items-center"
          onPress={handleFundWallet}
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

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full items-center">
            <Text className="text-lg font-bold mb-2 text-center">
              Wallet funded successfully!
            </Text>
            {cashbackAmount > 0 && (
              <Text className="text-sm text-gray-600 mb-6 text-center">
                You have received ₦{cashbackAmount.toFixed(2)} cashback for
                funding your wallet
              </Text>
            )}
            <TouchableOpacity
              className="bg-green-500 rounded-full py-3 px-6 flex-row items-center"
              onPress={handleSuccessClose}
            >
              <Text className="text-white font-semibold mr-2">
                Check balance
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

//// cardId and setamount were declared but were never used. please that portion of the screen with 7,000 should be editable. I have told you to stop giving me static codes, I am building this application for real world usage
