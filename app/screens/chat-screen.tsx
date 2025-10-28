import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderType: "rider" | "customer";
  timestamp: string;
  isRead: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [customer, setCustomer] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchChatData();
    // Set up real-time message listener (WebSocket/Firebase)
    // subscribeToMessages();
  }, []);

  const fetchChatData = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch(`YOUR_API_URL/orders/${params.orderId}/chat`, {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data
      const customerData: ChatUser = {
        id: "customer_1",
        name: "RUE LOGISTICS",
        avatar: undefined,
        phone: "+2348012345678",
      };

      const mockMessages: Message[] = [
        {
          id: "1",
          text: "Hi, where are you at the moment?",
          senderId: "customer_1",
          senderType: "customer",
          timestamp: "12:15 PM",
          isRead: true,
        },
        {
          id: "2",
          text: "Good afternoon, it's showing on your map nau",
          senderId: "rider_1",
          senderType: "rider",
          timestamp: "12:15 PM",
          isRead: true,
        },
        {
          id: "3",
          text: "Ok, i'm on my way to you now",
          senderId: "customer_1",
          senderType: "customer",
          timestamp: "12:18 PM",
          isRead: true,
        },
      ];

      setCustomer(customerData);
      setMessages(mockMessages);
      setLoading(false);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error fetching chat data:", error);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      senderId: "rider_1",
      senderType: "rider",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isRead: false,
    };

    // Optimistically add message to UI
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setSending(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Send message to server
      // await fetch('YOUR_API_URL/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({
      //     orderId: params.orderId,
      //     text: newMessage.text,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    } finally {
      setSending(false);
    }
  };

  const handleCall = () => {
    if (customer?.phone) {
      Linking.openURL(`tel:${customer.phone}`);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isRider = item.senderType === "rider";

    return (
      <View
        className={`flex-row mb-4 ${isRider ? "justify-end" : "justify-start"}`}
      >
        {/* Customer Avatar (left side) */}
        {!isRider && (
          <View className="mr-2">
            {customer?.avatar ? (
              <Image
                source={{ uri: customer.avatar }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
                <Ionicons name="person" size={20} color="#fff" />
              </View>
            )}
          </View>
        )}

        {/* Message Bubble */}
        <View className="max-w-[75%]">
          <View
            className={`rounded-2xl px-4 py-3 ${
              isRider ? "bg-green-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-base ${isRider ? "text-white" : "text-black"}`}
            >
              {item.text}
            </Text>
          </View>
          <Text
            className={`text-xs text-gray-400 mt-1 ${
              isRider ? "text-right" : "text-left"
            }`}
          >
            {item.timestamp}
          </Text>
        </View>

        {/* Rider Avatar (right side) */}
        {isRider && (
          <View className="ml-2">
            <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center">
              <Ionicons name="person" size={20} color="#fff" />
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="bg-green-400 px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            {/* Customer Info */}
            <View className="flex-row items-center flex-1">
              {customer?.avatar ? (
                <Image
                  source={{ uri: customer.avatar }}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                  <Ionicons name="person" size={20} color="#22c55e" />
                </View>
              )}
              <Text className="text-lg font-bold flex-1" numberOfLines={1}>
                {customer?.name || "Customer"}
              </Text>
            </View>
          </View>

          {/* Call Button */}
          <TouchableOpacity
            onPress={handleCall}
            className="w-12 h-12 bg-white rounded-full items-center justify-center"
          >
            <Ionicons name="call" size={20} color="#22c55e" />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View className="px-4 py-3 bg-white border-t border-gray-200">
          <View className="flex-row items-center">
            <View className="flex-1 bg-green-50 rounded-full px-4 py-3 mr-2">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={500}
                className="text-base"
                style={{ maxHeight: 100 }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputText.trim() || sending}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                inputText.trim() && !sending ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
