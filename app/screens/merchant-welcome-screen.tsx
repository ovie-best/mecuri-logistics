import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DeliveryAcceptanceModal, { DeliveryRequest } from "../components/DeliveryAcceptanceModal";
import { deliveryWebSocket, WebSocketMessage } from "../services/delivery-websocket";
import { getUserData } from "../utils/auth-storage";
import MenuScreen from "./menu-screen";

interface UserData {
  name: string;
  isVerified: boolean;
}

export default function MerchantWelcomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  
  // Delivery request modal state
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [currentDeliveryRequest, setCurrentDeliveryRequest] = useState<DeliveryRequest | null>(null);

  useEffect(() => {
    fetchUserData();
    connectSocket();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get user data from storage
      const storedUserData = await getUserData();
      
      if (storedUserData) {
        setUserData(storedUserData);
        console.log("User data loaded:", storedUserData);
      } else {
        // Fallback to API if no stored data
        const response = await fetch("http://10.10.30.42:8000/api/users/", {
          method: "GET",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYzNjYzMDg1LCJpYXQiOjE3NjM1NzY2OTksImp0aSI6ImQ3MzUwYjFjNzY4ZDRlODQ5YjgwYjE5YjJiMjMzMWU3IiwidXNlcl9pZCI6IjcifQ.tMiP10-2fW-FFkoRlDvBGzeCBtJyFQ9dMOLTo00Belg`,
          },
        });
        const data = await response.json();
        console.log("User data from API:", data);
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = () => {
    // Get driver ID from user data (adjust based on your data structure)
    const driverId = userData?.id || "driver_123";
    
    console.log("Connecting WebSocket for driver:", driverId);
    
    // Connect to WebSocket
    deliveryWebSocket.connect(driverId);

    // Listen for connection status changes
    const unsubscribeConnection = deliveryWebSocket.onConnectionChange((connected) => {
      console.log("WebSocket connection status:", connected);
      setWsConnected(connected);
      
      if (connected) {
        // Update driver status to online when connected
        deliveryWebSocket.updateDriverStatus('online');
      }
    });

    // Listen for incoming messages
    const unsubscribeMessages = deliveryWebSocket.onMessage((message: WebSocketMessage) => {
      console.log("Received message:", message);
      
      if (message.type === 'delivery_request') {
        // Show delivery acceptance modal
        const deliveryRequest: DeliveryRequest = message.data;
        setCurrentDeliveryRequest(deliveryRequest);
        setShowDeliveryModal(true);
      } else if (message.type === 'request_cancelled') {
        // Hide modal if request was cancelled
        setShowDeliveryModal(false);
        setCurrentDeliveryRequest(null);
      }
    });

    // Listen for errors
    const unsubscribeErrors = deliveryWebSocket.onError((error) => {
      console.error("WebSocket error:", error);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeConnection();
      unsubscribeMessages();
      unsubscribeErrors();
      deliveryWebSocket.disconnect();
    };
  };

  // Handle delivery request acceptance
  const handleAcceptDelivery = (requestId: string) => {
    console.log("Accepting delivery:", requestId);
    
    // Send acceptance to backend via WebSocket
    deliveryWebSocket.acceptDeliveryRequest(requestId);
    
    // Hide modal
    setShowDeliveryModal(false);
    setCurrentDeliveryRequest(null);
    
    // TODO: Navigate to delivery details screen or active delivery screen
    // router.push(`/screens/active-delivery-screen?deliveryId=${requestId}`);
  };

  // Handle delivery request decline
  const handleDeclineDelivery = (requestId: string) => {
    console.log("Declining delivery:", requestId);
    
    // Send decline to backend via WebSocket
    deliveryWebSocket.declineDeliveryRequest(requestId, "Driver declined");
    
    // Hide modal
    setShowDeliveryModal(false);
    setCurrentDeliveryRequest(null);
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
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with menu and notification icons */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white">
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/screens/notifications-screen")}
        >
          <Ionicons name="notifications" size={28} color="#22c55e" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View className="flex-1 px-6 py-4">
        {/* Welcome Text */}
        <Text className="text-2xl font-bold mb-8">
          Welcome, {userData?.name || "User"}
        </Text>

        {/* Registration Card */}
        <View className="bg-green-500 rounded-3xl p-6 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <View className="absolute -right-10 -top-10 w-40 h-40 bg-green-400 rounded-full opacity-20" />
          <View className="absolute -right-5 top-20 w-32 h-32 bg-green-400 rounded-full opacity-20" />

          {/* Card Content */}
          <View className="relative z-10">
            <Text className="text-white text-3xl font-bold mb-4 leading-tight">
              Become a{"\n"}verified rider{"\n"}to earn!
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/screens/checklist-screen")}
              className="bg-gray-800 px-6 py-3 rounded-full self-start"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Illustration Area - Right side */}
          <View className="absolute right-6 top-6 bottom-6">
            {/* You can add an image/illustration here */}
            {/* <Image source={require('./rider-illustration.png')} /> */}
            <View className="w-32 h-32 items-center justify-center">
              <Ionicons name="bicycle" size={64} color="#fff" opacity={0.3} />
            </View>
          </View>
        </View>

        {/* Additional content can go here */}
      </View>

      {/* Menu Overlay - Slides in from left */}
      <MenuScreen visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* Delivery Acceptance Modal */}
      <DeliveryAcceptanceModal
        visible={showDeliveryModal}
        deliveryRequest={currentDeliveryRequest}
        onAccept={handleAcceptDelivery}
        onDecline={handleDeclineDelivery}
        autoDeclineSeconds={30}
      />
    </SafeAreaView>
  );
}
