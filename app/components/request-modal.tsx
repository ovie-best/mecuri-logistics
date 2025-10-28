// components/RequestModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useDeliveryStore } from "../stores/DeliveryStore";

export default function RequestModal() {
  const { status, job, acceptJob, declineJob } = useDeliveryStore();
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (status === "INCOMING") {
      setVisible(true);
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            declineJob();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setVisible(false);
    }
  }, [status]);

  if (!job) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white p-6 rounded-t-3xl">
          <Text className="text-xl font-bold text-green-600">
            DELIVERY REQUEST!
          </Text>
          <Text className="mt-4">Merchant: {job.merchant}</Text>
          <Text>Pickup: {job.pickupAddress}</Text>
          <Text>Dropoff: {job.dropoffAddress}</Text>
          <Text>Amount: ₦{job.amount}</Text>
          <Text className="mt-4 text-red-500">Time left: {countdown}s</Text>
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity
              onPress={declineJob}
              className="bg-gray-300 p-4 rounded-full flex-1 mr-2"
            >
              <Text className="text-center">Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={acceptJob}
              className="bg-green-500 p-4 rounded-full flex-1 ml-2"
            >
              <Text className="text-center text-white">Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
