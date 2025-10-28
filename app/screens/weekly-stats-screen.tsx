import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface WeeklyStats {
  weeklyDeliveries: number[];
  totalDeliveries: number;
  weekStartDate: string;
  weekEndDate: string;
}

export default function WeeklyStatsScreen() {
  const router = useRouter();

  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  const fetchWeeklyStats = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/rider/stats/weekly', {
      //   headers: {
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();

      // Mock data - replace with actual API response
      const data: WeeklyStats = {
        weeklyDeliveries: [30, 45, 52, 38, 60, 70, 85],
        totalDeliveries: 120,
        weekStartDate: "Dec 16",
        weekEndDate: "Dec 22",
      };

      setStats(data);
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">No statistics available</Text>
      </View>
    );
  }

  const maxDeliveries = Math.max(...stats.weeklyDeliveries);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Weekly Statistics</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-6 py-8">
        {/* Week Range */}
        {stats.weekStartDate && stats.weekEndDate && (
          <Text className="text-center text-gray-500 mb-8">
            {stats.weekStartDate} - {stats.weekEndDate}
          </Text>
        )}

        {/* Bar Chart */}
        <View className="mb-8">
          <View
            className="flex-row items-end justify-between"
            style={{ height: 280 }}
          >
            {stats.weeklyDeliveries.map((count, index) => {
              const barHeight = (count / maxDeliveries) * 100;
              const isHighlighted = count === maxDeliveries;

              return (
                <View
                  key={index}
                  className="flex-1 items-center justify-end mx-1"
                >
                  {/* Bar */}
                  <View
                    className={`w-full rounded-t-lg overflow-hidden ${
                      isHighlighted ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{ height: `${barHeight}%`, minHeight: 20 }}
                  >
                    {/* Green gradient bottom half for non-highlighted bars */}
                    {!isHighlighted && (
                      <View
                        className="w-full bg-green-500 absolute bottom-0 left-0 right-0"
                        style={{ height: "50%" }}
                      />
                    )}
                  </View>

                  {/* Day Label */}
                  <Text className="text-xs mt-2 text-gray-600 font-medium">
                    {weekDays[index]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Success Message */}
        <View className="bg-green-50 rounded-xl p-4 mb-6">
          <Text className="text-green-600 font-semibold text-center text-base">
            Impressive! You made {stats.totalDeliveries} deliveries in total
            this week.
          </Text>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          className="bg-green-500 rounded-full py-4 items-center"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold text-base">Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
