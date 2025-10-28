import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
}

export default function SavedCardScreen() {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
          last4: "4567",
          brand: "Mastercard",
          cardHolder: "ABRAHAM ABIOLA OSAS",
          expiryMonth: "12",
          expiryYear: "25",
        },
      ];

      setSavedCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCard = (cardId: string) => {
    // Navigate to amount selection screen with card ID
    router.push({
      pathname: "/screens/fund-amount-screen",
      params: { cardId },
    });
  };

  const handleDeletePress = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCardId) return;

    setDeleting(true);
    try {
      // Replace with your actual API endpoint
      // await fetch(`YOUR_API_URL/payment/cards/${selectedCardId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove card from state
      setSavedCards(savedCards.filter((card) => card.id !== selectedCardId));
      setShowDeleteModal(false);
      setSelectedCardId(null);

      Alert.alert("Success", "Card deleted successfully");
    } catch (error) {
      console.error("Delete card error:", error);
      Alert.alert("Error", "Failed to delete card. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCardId(null);
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
        <Text className="text-lg font-semibold">Saved Card</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {savedCards.length > 0 ? (
          savedCards.map((card) => (
            <View key={card.id}>
              {/* Green dot indicator */}
              <View className="mb-4">
                <View className="w-3 h-3 rounded-full bg-green-500" />
              </View>

              {/* Card Display */}
              <View className="bg-green-600 rounded-2xl p-6 mb-6 relative">
                {/* Mastercard Logo */}
                <View className="absolute top-4 right-4 flex-row">
                  <View className="w-8 h-8 rounded-full bg-red-500 opacity-90" />
                  <View
                    className="w-8 h-8 rounded-full bg-orange-400 opacity-90"
                    style={{ marginLeft: -12 }}
                  />
                </View>

                {/* Card Holder Name */}
                <Text className="text-white text-sm font-medium mb-4">
                  {card.cardHolder}
                </Text>

                {/* Card Number */}
                <Text className="text-white text-lg tracking-wider">
                  •••• •••• •••• {card.last4}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className="items-center py-12">
            <Ionicons name="card-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">No saved cards</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Buttons - Only show if there are cards */}
      {savedCards.length > 0 && (
        <View className="px-6 pb-8 pt-4">
          <TouchableOpacity
            className="bg-green-500 rounded-full py-4 items-center mb-3"
            onPress={() => handleUseCard(savedCards[0].id)}
          >
            <Text className="text-white font-semibold text-base">Use Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 rounded-full py-4 items-center"
            onPress={() => handleDeletePress(savedCards[0].id)}
          >
            <Text className="text-white font-semibold text-base">
              Delete Card
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-base text-center mb-6">
              Are you sure you want to delete this card?
            </Text>
            <View className="flex-row justify-center space-x-3">
              <TouchableOpacity
                className="bg-green-500 rounded-full py-3 px-8"
                onPress={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Yes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-500 rounded-full py-3 px-8 ml-3"
                onPress={handleCancelDelete}
                disabled={deleting}
              >
                <Text className="text-white font-semibold">No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
