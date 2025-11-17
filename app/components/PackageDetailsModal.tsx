import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export interface PackageDetails {
  type: string;
  category?: string;
  itemValue: string;
  description?: string;
}

interface PackageDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (details: PackageDetails) => void;
  initialDetails?: PackageDetails;
}

const PACKAGE_TYPES = [
  { label: "Envelope", value: "envelope" },
  { label: "Small Package", value: "small" },
  { label: "Medium Package", value: "medium" },
  { label: "Large Package", value: "large" },
  { label: "Box", value: "box" },
  { label: "Document", value: "document" },
];

const PACKAGE_CATEGORIES = [
  { label: "Electronics", value: "electronics" },
  { label: "Fragile", value: "fragile" },
  { label: "Documents", value: "documents" },
  { label: "Clothing", value: "clothing" },
  { label: "Food", value: "food" },
  { label: "Books", value: "books" },
  { label: "Others", value: "others" },
];

interface DropdownListProps {
  visible: boolean;
  items: { label: string; value: string }[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

const DropdownList: React.FC<DropdownListProps> = ({
  visible,
  items,
  onSelect,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />
      <View className="bg-white rounded-t-2xl max-h-96">
        <FlatList
          scrollEnabled
          data={items}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelect(item.value);
                onClose();
              }}
              className="border-b border-gray-100 px-6 py-4 active:bg-gray-50"
            >
              <Text className="text-gray-900 font-medium text-base">
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
};

export const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({
  visible,
  onClose,
  onSave,
  initialDetails,
}) => {
  const [packageType, setPackageType] = useState(
    initialDetails?.type || "envelope"
  );
  const [category, setCategory] = useState(initialDetails?.category || "");
  const [itemValue, setItemValue] = useState(initialDetails?.itemValue || "");
  const [description, setDescription] = useState(
    initialDetails?.description || ""
  );
  const [typeDropdownVisible, setTypeDropdownVisible] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

  useEffect(() => {
    if (visible && initialDetails) {
      setPackageType(initialDetails.type || "envelope");
      setCategory(initialDetails.category || "");
      setItemValue(initialDetails.itemValue || "");
      setDescription(initialDetails.description || "");
    }
  }, [visible, initialDetails]);

  const handleSave = () => {
    if (!packageType || !itemValue.trim()) {
      alert("Please fill in package type and item value");
      return;
    }

    onSave({
      type: packageType,
      category: category || undefined,
      itemValue,
      description: description || undefined,
    });

    onClose();
  };

  const selectedTypeLabel =
    PACKAGE_TYPES.find((t) => t.value === packageType)?.label || "Select type";
  const selectedCategoryLabel =
    PACKAGE_CATEGORIES.find((c) => c.value === category)?.label ||
    "Select category";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-gray-900/50">
        <View className="flex-1 justify-end">
          {/* Modal Content */}
          <View className="bg-white rounded-t-3xl max-h-5/6">
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <Text className="text-lg font-bold text-gray-900">
                  Package Details
                </Text>
                <Pressable onPress={onClose} className="p-2 active:opacity-60">
                  <Ionicons name="close" size={24} color="black" />
                </Pressable>
              </View>

              {/* Package Type */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Package Type
                </Text>
                <Pressable
                  onPress={() => setTypeDropdownVisible(true)}
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row items-center justify-between active:opacity-60"
                >
                  <Text className="text-gray-900 text-base font-medium">
                    {selectedTypeLabel}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
              </View>

              {/* Package Category */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Package Category (Optional)
                </Text>
                <Pressable
                  onPress={() => setCategoryDropdownVisible(true)}
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row items-center justify-between active:opacity-60"
                >
                  <Text
                    className={`text-base font-medium ${
                      category ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {selectedCategoryLabel}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                </Pressable>
              </View>

              {/* Item Value */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Item Value
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white gap-2">
                  <Text className="text-emerald-600 font-bold text-lg">₦</Text>
                  <TextInput
                    placeholder="0.00"
                    value={itemValue}
                    onChangeText={setItemValue}
                    keyboardType="decimal-pad"
                    className="flex-1 text-gray-900 text-base font-medium"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Description */}
              <View className="mb-8">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </Text>
                <View className="border border-gray-300 rounded-lg px-4 py-3 bg-white">
                  <TextInput
                    placeholder="Describe your package contents"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="text-gray-900 text-base"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View className="gap-3 mb-6">
                <Pressable
                  onPress={handleSave}
                  className="bg-emerald-500 rounded-full py-4 items-center justify-center active:opacity-80"
                >
                  <Text className="text-white font-bold text-lg">
                    Add details
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onClose}
                  className="border-2 border-gray-300 rounded-full py-4 items-center justify-center active:opacity-80"
                >
                  <Text className="text-gray-800 font-bold text-lg">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>

      {/* Type Dropdown */}
      <DropdownList
        visible={typeDropdownVisible}
        items={PACKAGE_TYPES}
        onSelect={setPackageType}
        onClose={() => setTypeDropdownVisible(false)}
      />

      {/* Category Dropdown */}
      <DropdownList
        visible={categoryDropdownVisible}
        items={PACKAGE_CATEGORIES}
        onSelect={setCategory}
        onClose={() => setCategoryDropdownVisible(false)}
      />
    </Modal>
  );
};
