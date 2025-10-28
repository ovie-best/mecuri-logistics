import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
}

export default function PaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const amount = params.amount ? parseFloat(params.amount as string) : 0;

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/payment/cards', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data
      const data: SavedCard[] = [
        {
          id: "card_1",
          last4: "4242",
          brand: "Mastercard",
          expiryMonth: "12",
          expiryYear: "25",
        },
      ];

      setSavedCards(data);
      if (data.length > 0) {
        setSelectedCard(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCard = () => {
    router.push({
      pathname: "/screens/add-card-screen",
      params: { amount, returnTo: "payment-method" },
    });
  };

  const handleProceed = async () => {
    if (!selectedCard) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    setProcessing(true);
    try {
      // Replace with your actual payment API
      // const response = await fetch('YOUR_API_URL/payment/process', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({
      //     cardId: selectedCard,
      //     amount: amount,
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate back to wallet with refresh
    router.push("/screens/wallet-screen");
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

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
        <Text className="text-base font-semibold mb-4">Payment method</Text>

        {/* Saved Cards */}
        {savedCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => setSelectedCard(card.id)}
            className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border-2 ${
              selectedCard === card.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <View className="flex-row items-center flex-1">
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                  selectedCard === card.id
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              >
                {selectedCard === card.id && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <View>
                <Text className="text-base font-medium">{card.brand}</Text>
                <Text className="text-sm text-gray-500">•••• {card.last4}</Text>
              </View>
            </View>
            <Ionicons name="card-outline" size={24} color="#22c55e" />
          </TouchableOpacity>
        ))}

        {/* Add New Card Button */}
        <TouchableOpacity
          onPress={handleAddNewCard}
          className="flex-row items-center p-4 mb-3 rounded-xl border-2 border-dashed border-gray-300"
        >
          <Ionicons name="add-circle-outline" size={24} color="#22c55e" />
          <Text className="text-base font-medium ml-3 text-green-600">
            Add new card
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Section */}
      <View className="px-6 pb-8 pt-4 border-t border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-600">Amount to add</Text>
          <Text className="text-2xl font-bold text-green-600">
            ₦{amount.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-green-500 rounded-full py-4 items-center"
          onPress={handleProceed}
          disabled={processing || !selectedCard}
        >
          {processing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Proceed to payment
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
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark" size={48} color="#22c55e" />
            </View>
            <Text className="text-lg font-bold mb-2">
              Wallet funded successfully
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6">
              ₦{amount.toLocaleString()} has been added to your wallet
            </Text>
            <TouchableOpacity
              className="bg-green-500 rounded-full py-3 px-12"
              onPress={handleSuccessClose}
            >
              <Text className="text-white font-semibold">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
