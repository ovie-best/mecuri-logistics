import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Notification {
  id: string;
  type: "payment" | "debt" | "statistics" | "info";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionType?: "checkWallet" | "fundWallet" | "viewStatistics";
  amount?: number;
  metadata?: any;
}

interface NotificationsScreenProps {
  onClose?: () => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onClose,
}) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/notifications', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data - replace with actual API response
      const data: Notification[] = [
        {
          id: "1",
          type: "payment",
          title: "PAYMENT!",
          message:
            "You have just received ₦3200 (from Relo Joshua) as payment from your previous ride. Visit wallet to withdraw.",
          timestamp: "1:22 pm",
          isRead: false,
          actionType: "checkWallet",
          amount: 3200,
        },
        {
          id: "2",
          type: "debt",
          title: "DEBT!",
          message:
            "You still owe ₦200 as commission from your last ride. You have till Friday, 23rd September, 2024 to fund your wallet. Your account will be banned if you do not meet the given deadline. Go to wallet now and fund!",
          timestamp: "1:35 pm",
          isRead: false,
          actionType: "fundWallet",
          amount: 200,
        },
        {
          id: "3",
          type: "statistics",
          title: "WEEKLY STATISTICS",
          message:
            "You've had a phenomenal week!, a busy one choked with back to back deliveries. CONGRATULATIONS!! Click to see full statistics.",
          timestamp: "1:42 pm",
          isRead: false,
          actionType: "viewStatistics",
          metadata: {
            weeklyDeliveries: [30, 45, 52, 38, 60, 70, 85],
            totalDeliveries: 120,
          },
        },
      ];

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleAction = async (notification: Notification) => {
    // Mark notification as read
    try {
      // await fetch(`YOUR_API_URL/notifications/${notification.id}/read`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    // Close modal if onClose function is provided
    if (onClose) {
      onClose();
    }

    // Handle different action types
    switch (notification.actionType) {
      case "checkWallet":
        router.push("/screens/wallet-screen");
        break;

      case "fundWallet":
        router.push("/screens/add-funds-screen");
        break;

      case "viewStatistics":
        router.push({
          pathname: "/screens/weekly-stats-screen",
          params: { notificationId: notification.id },
        });
        break;

      default:
        break;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "payment":
        return {
          containerClass: "bg-green-50",
          titleClass: "text-green-800",
          messageClass: "text-green-700",
          buttonClass: "bg-green-500",
        };
      case "debt":
        return {
          containerClass: "bg-red-50",
          titleClass: "text-red-800",
          messageClass: "text-red-700",
          buttonClass: "bg-red-500",
        };
      case "statistics":
        return {
          containerClass: "bg-blue-50",
          titleClass: "text-blue-800",
          messageClass: "text-blue-700",
          buttonClass: "bg-blue-500",
        };
      default:
        return {
          containerClass: "bg-gray-50",
          titleClass: "text-gray-800",
          messageClass: "text-gray-700",
          buttonClass: "bg-gray-500",
        };
    }
  };

  const getButtonText = (actionType?: string) => {
    switch (actionType) {
      case "checkWallet":
        return "Check wallet";
      case "fundWallet":
        return "Fund wallet";
      case "viewStatistics":
        return "View statistics";
      default:
        return "View";
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Notification Header */}
      <View className="flex-row justify-between items-center p-6 bg-gray-100">
        <Text className="text-xl font-bold">Notifications</Text>
        <TouchableOpacity onPress={onClose || (() => router.back())}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Notification Content */}
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const style = getNotificationStyle(notification.type);
            return (
              <View
                key={notification.id}
                className={`${style.containerClass} p-4 rounded-xl mb-4`}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className={`font-bold ${style.titleClass}`}>
                    {notification.title}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {notification.timestamp}
                  </Text>
                </View>
                <Text className={`text-sm ${style.messageClass} mb-3`}>
                  {notification.message}
                </Text>
                {notification.actionType && (
                  <TouchableOpacity
                    className={`${style.buttonClass} px-4 py-2 rounded-full self-start`}
                    onPress={() => handleAction(notification)}
                  >
                    <Text className="text-white text-sm font-medium">
                      {getButtonText(notification.actionType)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <View className="items-center py-12">
            <Ionicons name="notifications-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">
              No notifications yet
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
