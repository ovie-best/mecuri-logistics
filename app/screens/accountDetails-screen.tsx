import { useRegistration } from "@/context/registration-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// List of Nigerian banks
const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank",
  "Globus Bank",
  "Guaranty Trust Bank",
  "Heritage Bank",
  "Jaiz Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
].sort(); // Sort alphabetically

export default function AccountDetailsScreen() {
  const { setStep } = useRegistration();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter banks based on search query
  const filteredBanks = NIGERIAN_BANKS.filter((bank) =>
    bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirm = () => {
    // Validate required fields
    if (!firstName || !lastName || !accountNumber || !bankName) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Validate account number (basic validation)
    if (accountNumber.length < 10 || !/^\d+$/.test(accountNumber)) {
      Alert.alert(
        "Error",
        "Please enter a valid account number (minimum 10 digits)"
      );
      return;
    }

    setStep("accountDetails", true);
    router.back();
  };

  const selectBank = (bank: string) => {
    setBankName(bank);
    setShowBankModal(false);
    setSearchQuery(""); // Clear search when bank is selected
  };

  return (
    <View className="flex-1 bg-white p-6">
      <SafeAreaView>
        <View className="flex-row justify-between p-6 bg-white">
          <TouchableOpacity
            onPress={() => router.push("/screens/merchant-welcome-screen")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl text-center font-bold mb-4">
            Account Details
          </Text>
        </View>

        <View className="space-y-4">
          {/* First Name */}
          <View className="mb-5">
            <TextInput
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              className="border border-gray-300 p-4 rounded-xl"
              autoCapitalize="words"
            />
          </View>

          {/* Middle Name (Optional) */}
          <View className="mb-5">
            <TextInput
              placeholder="Enter your middle name"
              value={middleName}
              onChangeText={setMiddleName}
              className="border border-gray-300 p-4 rounded-xl"
              autoCapitalize="words"
            />
          </View>

          {/* Last Name */}
          <View className="mb-5">
            <TextInput
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              className="border border-gray-300 p-4 rounded-xl"
              autoCapitalize="words"
            />
          </View>

          {/* Account Number */}
          <View className="mb-5">
            <TextInput
              placeholder="Enter your account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              className="border border-gray-300 p-4 rounded-xl"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Bank Selector */}
          <View>
            <TouchableOpacity
              onPress={() => setShowBankModal(true)}
              className="border border-gray-300 p-4 rounded-xl flex-row justify-between items-center"
            >
              <Text className={bankName ? "text-black" : "text-gray-400"}>
                {bankName || "Select your bank"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Instruction text */}
        <Text className="text-red-700 mb-6 text-sm bg-red-50 p-5 rounded-xl mt-8">
          These account names must tally with the name you signed up with.
        </Text>

        <TouchableOpacity
          onPress={confirm}
          className="bg-green-500 py-4 rounded-3xl items-center mt-8"
        >
          <Text className="text-white font-semibold text-lg">Confirm</Text>
        </TouchableOpacity>

        {/* Bank Selection Modal */}
        <Modal
          visible={showBankModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowBankModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowBankModal(false)}>
            <View className="flex-1 bg-black/50 justify-end">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-t-3xl max-h-3/4">
                  {/* Header */}
                  <View className="p-4 border-b border-gray-200">
                    <Text className="text-xl font-bold text-center">
                      Select Bank
                    </Text>
                  </View>

                  {/* Search Bar */}
                  <View className="p-4 border-b border-gray-200">
                    <View className="flex-row items-center bg-gray-100 rounded-lg px-3">
                      <Ionicons name="search" size={20} color="#6B7280" />
                      <TextInput
                        placeholder="Search for a bank"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 p-3"
                        autoFocus={true}
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#6B7280"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Banks List */}
                  <FlatList
                    data={filteredBanks}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => selectBank(item)}
                        className="p-4 border-b border-gray-100"
                      >
                        <Text className="text-base">{item}</Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <View className="p-4 items-center">
                        <Text className="text-gray-500">No banks found</Text>
                      </View>
                    }
                    className="max-h-64"
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
