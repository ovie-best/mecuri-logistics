import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Types
interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface WalletData {
  balance: number;
  cashback: number;
  rating: number;
  transactions: Transaction[];
}

export default function WalletScreen() {
  const router = useRouter();

  // State management
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [showHistoryExpanded, setShowHistoryExpanded] = useState(true);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/wallet', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data for now - replace with actual API call
      const data: WalletData = {
        balance: 15000.0,
        cashback: 250,
        rating: 4.5,
        transactions: [
          {
            id: "1",
            type: "credit",
            amount: 2500,
            description: "Ride to Ikeja",
            date: "2024-01-15T10:30:00",
            status: "completed",
          },
          {
            id: "2",
            type: "debit",
            amount: 5000,
            description: "Withdrawal",
            date: "2024-01-14T14:20:00",
            status: "completed",
          },
        ],
      };

      setWalletData(data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      // Show error toast/alert
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchWalletData();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  // Validate withdrawal amount
  const validateWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return false;
    }

    if (!walletData || amount > walletData.balance) {
      setShowWithdrawModal(false);
      setShowInsufficientModal(true);
      return false;
    }

    return true;
  };

  const handleWithdrawPress = () => {
    setWithdrawAmount("");
    setShowWithdrawModal(true);
  };

  const handleWithdrawAll = () => {
    if (!walletData || walletData.balance <= 0) {
      setShowWithdrawModal(false);
      setShowInsufficientModal(true);
      return;
    }
    setWithdrawAmount(walletData.balance.toString());
    setShowWithdrawModal(false);
    setShowConfirmModal(true);
  };

  const handleWithdrawSubmit = () => {
    if (!validateWithdrawal()) return;
    setShowWithdrawModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmYes = async () => {
    setShowConfirmModal(false);
    setWithdrawing(true);

    try {
      // Replace with your actual withdrawal API
      // const response = await fetch('YOUR_API_URL/wallet/withdraw', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({
      //     amount: parseFloat(withdrawAmount),
      //   }),
      // });

      // if (!response.ok) throw new Error('Withdrawal failed');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state optimistically
      if (walletData) {
        setWalletData({
          ...walletData,
          balance: walletData.balance - parseFloat(withdrawAmount),
        });
      }

      setShowSuccessModal(true);
      setWithdrawAmount("");

      // Refresh wallet data after withdrawal
      setTimeout(() => {
        fetchWalletData();
      }, 2000);
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert("Withdrawal failed. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setWithdrawAmount("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mx-6 mt-6">
          <View className="bg-gray-50 rounded-2xl p-6 relative overflow-hidden">
            {/* Decorative wavy line background */}
            <View className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
              <View
                className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300"
                style={{
                  transform: [{ translateY: -20 }],
                  borderTopLeftRadius: 100,
                  borderTopRightRadius: 100,
                }}
              />
            </View>

            {/* Header with Eye Icon */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Text className="text-base font-semibold">
                  Available Balance
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setBalanceVisible(!balanceVisible)}
              >
                <Ionicons
                  name={balanceVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            {/* Balance Display */}
            <View className="mb-6">
              {balanceVisible ? (
                <Text className="text-4xl font-bold text-green-500">
                  ₦
                  {walletData?.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              ) : (
                <Text className="text-4xl font-bold text-green-500">****</Text>
              )}
            </View>

            {/* Action Buttons - Bottom Right */}
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                className="bg-green-500 rounded-xl py-3 px-4 flex-row items-center"
                onPress={handleWithdrawPress}
                disabled={withdrawing}
              >
                {withdrawing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="wallet-outline" size={20} color="#fff" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-500 rounded-xl py-3 px-4 flex-row items-center ml-3"
                onPress={() => router.push("/screens/add-funds-screen")}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View className="mx-6 mt-8">
          <TouchableOpacity
            className="flex-row items-center justify-between mb-4"
            onPress={() => setShowHistoryExpanded(!showHistoryExpanded)}
          >
            <Text className="text-base font-semibold">Transaction History</Text>
            <Ionicons
              name={showHistoryExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>

          {showHistoryExpanded && (
            <View>
              {walletData?.transactions &&
              walletData.transactions.length > 0 ? (
                walletData.transactions.map((transaction) => (
                  <View
                    key={transaction.id}
                    className="bg-gray-50 rounded-xl p-4 mb-3 flex-row justify-between items-center"
                  >
                    <View className="flex-1">
                      <Text className="font-semibold mb-1">
                        {transaction.description}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {formatDate(transaction.date)}
                      </Text>
                    </View>
                    <Text
                      className={`font-bold ${
                        transaction.type === "credit"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₦
                      {transaction.amount.toLocaleString()}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="items-center py-12">
                  <Text className="text-gray-400">No transactions yet</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-lg font-semibold mb-4">
              Amount To Withdraw
            </Text>
            <Text className="text-xs text-gray-500 mb-2">
              Available: ₦{walletData?.balance.toLocaleString()}
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Enter amount"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />
            <TouchableOpacity
              className="bg-green-500 rounded-full py-3 items-center mb-3"
              onPress={handleWithdrawSubmit}
            >
              <Text className="text-white font-semibold">Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 rounded-full py-3 items-center mb-3"
              onPress={handleWithdrawAll}
            >
              <Text className="text-gray-700 font-semibold">Withdraw all</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-200 rounded-full py-3 items-center"
              onPress={() => setShowWithdrawModal(false)}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Other modals remain the same */}
      <Modal
        visible={showInsufficientModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInsufficientModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full items-center">
            <Text className="text-lg font-bold mb-2">Not enough balance!</Text>
            <Text className="text-sm text-gray-600 text-center mb-6">
              You don&apos;t have enough funds in your account. Complete more
              rides to earn.
            </Text>
            <TouchableOpacity
              className="bg-green-500 rounded-full py-3 px-12"
              onPress={() => setShowInsufficientModal(false)}
            >
              <Text className="text-white font-semibold">Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full items-center">
            <Text className="text-lg font-bold mb-2">Are you sure?</Text>
            <Text className="text-sm text-gray-600 mb-6">
              Withdraw ₦{parseFloat(withdrawAmount).toLocaleString()}
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                className="bg-green-500 rounded-full py-3 px-8"
                onPress={handleConfirmYes}
              >
                <Text className="text-white font-semibold">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-200 rounded-full py-3 px-8 ml-4"
                onPress={handleConfirmNo}
              >
                <Text className="text-gray-700 font-semibold">No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full items-center">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark" size={48} color="#22c55e" />
            </View>
            <Text className="text-lg font-bold mb-2">
              Withdrawal Successful
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6">
              Money will be transferred to your account. You will get a
              confirmation message.
            </Text>
            <TouchableOpacity
              className="bg-green-500 rounded-full py-3 px-12"
              onPress={() => setShowSuccessModal(false)}
            >
              <Text className="text-white font-semibold">Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
