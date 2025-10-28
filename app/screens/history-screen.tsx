import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Types
interface RideHistory {
  id: string;
  customerName: string;
  customerAvatar?: string;
  amount: number;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  status: "completed" | "cancelled";
}

interface HistoryStats {
  totalRides: number;
  totalEarnings: number;
}

export default function HistoryScreen() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [historyData, setHistoryData] = useState<RideHistory[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Generate week dates for the date picker
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);

    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const formatDateLabel = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Fetch history data
  const fetchHistoryData = async (date: Date) => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch(`YOUR_API_URL/history?date=${date.toISOString()}`, {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data - replace with actual API call
      const mockData: RideHistory[] = [
        {
          id: "1",
          customerName: "Jerry Williams",
          amount: 2700,
          pickupLocation: "Nadia Bakery, Ugbowo",
          dropoffLocation: "Image Garden, GRA",
          date: date.toISOString(),
          status: "completed",
        },
        {
          id: "2",
          customerName: "Jerry Williams",
          amount: 4600,
          pickupLocation: "Nadia Bakery, Ugbowo",
          dropoffLocation: "Image Garden, GRA",
          date: date.toISOString(),
          status: "completed",
        },
      ];

      const mockStats: HistoryStats = {
        totalRides: 40,
        totalEarnings: 125000,
      };

      setHistoryData(mockData);
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching history:", error);
      // Show error toast/alert
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistoryData(selectedDate);
  }, [selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistoryData(selectedDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setLoading(true);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-gray-100">
        <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">History</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Date Selector */}
      <View className="bg-white px-4 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {weekDates.map((date, index) => {
            const isSelected = isSameDate(date, selectedDate);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleDateSelect(date)}
                className={`mx-1 px-4 py-2 rounded-lg ${
                  isSelected ? "bg-green-500" : "bg-gray-100"
                }`}
                style={{ minWidth: 60 }}
              >
                <Text
                  className={`text-xs text-center mb-1 ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  {formatDateLabel(date)}
                </Text>
                <Text
                  className={`text-base font-bold text-center ${
                    isSelected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Stats Cards */}
      <View className="flex-row px-4 py-4">
        <View className="flex-1 bg-green-500 rounded-xl p-4 mr-2 flex-row items-center">
          <Ionicons name="bicycle" size={24} color="#fff" />
          <View className="ml-3">
            <Text className="text-white text-xs">Total Rides</Text>
            <Text className="text-white text-2xl font-bold">
              {stats?.totalRides || 0}
            </Text>
          </View>
        </View>
        <View className="flex-1 bg-green-500 rounded-xl p-4 ml-2 flex-row items-center">
          <Ionicons name="wallet" size={24} color="#fff" />
          <View className="ml-3">
            <Text className="text-white text-xs">Earned</Text>
            <Text className="text-white text-lg font-bold">
              ₦{stats?.totalEarnings.toLocaleString() || "0"}
            </Text>
          </View>
        </View>
      </View>

      {/* Ride History List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {historyData.length > 0 ? (
          historyData.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              className="bg-white rounded-2xl p-4 mb-3"
              onPress={() => {
                // Navigate to ride details
                // router.push(`/screens/ride-details/${ride.id}`);
              }}
            >
              {/* Customer Info */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  {ride.customerAvatar ? (
                    <Image
                      source={{ uri: ride.customerAvatar }}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                      <Ionicons name="person" size={20} color="#ef4444" />
                    </View>
                  )}
                  <Text className="ml-3 font-semibold text-base">
                    {ride.customerName}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold">
                    ₦{ride.amount.toLocaleString()}
                  </Text>
                  <Text className="text-xs text-gray-500">Today</Text>
                </View>
              </View>

              {/* Divider */}
              <View className="border-t border-gray-100 mb-3" />

              {/* Locations */}
              <View>
                <Text className="text-gray-300 font-bold">PICK UP</Text>
                <Text className="text-sm font-medium mb-2">
                  {ride.pickupLocation}
                </Text>
                <View className="flex-row items-center mb-2">
                  <View className="w-1 h-6 bg-gray-300 mr-3" />
                  <View className="flex-1 border-b border-dashed border-gray-300" />
                </View>
                <Text className="text-gray-300 font-bold">DROP OFF</Text>
                <Text className="text-sm font-medium">
                  {ride.dropoffLocation}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="time-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-400 text-lg mt-4">
              No rides for this date
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              Select another date to view history
            </Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
