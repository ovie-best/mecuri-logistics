import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width, height } = Dimensions.get("window");

export interface DeliveryRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffAddress: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  packageType: string;
  packageDetails?: string;
  estimatedDistance: number; // in km
  estimatedDuration: number; // in minutes
  deliveryFee: number;
  createdAt: string;
}

interface DeliveryAcceptanceModalProps {
  visible: boolean;
  deliveryRequest: DeliveryRequest | null;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  autoDeclineSeconds?: number; // Auto-decline after X seconds
}

const DeliveryAcceptanceModal: React.FC<DeliveryAcceptanceModalProps> = ({
  visible,
  deliveryRequest,
  onAccept,
  onDecline,
  autoDeclineSeconds = 30,
}) => {
  const [countdown, setCountdown] = useState(autoDeclineSeconds);
  const [scaleAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Reset countdown when modal becomes visible
  useEffect(() => {
    if (visible) {
      setCountdown(autoDeclineSeconds);
      
      // Trigger haptic feedback when modal appears
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      
      // Scale in animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [visible]);

  // Countdown timer
  useEffect(() => {
    if (!visible || !deliveryRequest) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto-decline when countdown reaches 0
          onDecline(deliveryRequest.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, deliveryRequest]);

  const handleAccept = () => {
    if (!deliveryRequest) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onAccept(deliveryRequest.id);
  };

  const handleDecline = () => {
    if (!deliveryRequest) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecline(deliveryRequest.id);
  };

  if (!deliveryRequest) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDecline}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: "100%",
            maxWidth: 400,
          }}
          className="bg-white rounded-3xl overflow-hidden"
        >
          {/* Header with countdown */}
          <View className="bg-green-500 px-6 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="notifications" size={24} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">
                  New Delivery Request
                </Text>
              </View>
              <View className="bg-white/20 rounded-full px-3 py-1">
                <Text className="text-white font-bold text-base">
                  {countdown}s
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Info */}
          <View className="px-6 py-4 border-b border-gray-100">
            <Text className="text-gray-500 text-xs font-semibold uppercase mb-1">
              Customer
            </Text>
            <Text className="text-gray-900 font-bold text-base">
              {deliveryRequest.customerName}
            </Text>
            {deliveryRequest.customerPhone && (
              <Text className="text-gray-600 text-sm mt-1">
                {deliveryRequest.customerPhone}
              </Text>
            )}
          </View>

          {/* Pickup Location */}
          <View className="px-6 py-4 border-b border-gray-100">
            <View className="flex-row items-start">
              <View className="bg-green-100 rounded-full p-2 mr-3">
                <Ionicons name="location" size={20} color="#22c55e" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs font-semibold uppercase mb-1">
                  Pickup Location
                </Text>
                <Text className="text-gray-900 font-medium text-sm">
                  {deliveryRequest.pickupAddress}
                </Text>
              </View>
            </View>
          </View>

          {/* Dropoff Location */}
          <View className="px-6 py-4 border-b border-gray-100">
            <View className="flex-row items-start">
              <View className="bg-red-100 rounded-full p-2 mr-3">
                <Ionicons name="flag" size={20} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-xs font-semibold uppercase mb-1">
                  Dropoff Location
                </Text>
                <Text className="text-gray-900 font-medium text-sm">
                  {deliveryRequest.dropoffAddress}
                </Text>
              </View>
            </View>
          </View>

          {/* Package Details */}
          <View className="px-6 py-4 border-b border-gray-100">
            <Text className="text-gray-500 text-xs font-semibold uppercase mb-2">
              Package Details
            </Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="cube-outline" size={16} color="#6b7280" />
              <Text className="text-gray-700 text-sm ml-2">
                {deliveryRequest.packageType}
              </Text>
            </View>
            {deliveryRequest.packageDetails && (
              <Text className="text-gray-600 text-sm">
                {deliveryRequest.packageDetails}
              </Text>
            )}
          </View>

          {/* Delivery Info */}
          <View className="px-6 py-4 bg-gray-50">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Ionicons name="navigate-outline" size={16} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-2">Distance</Text>
              </View>
              <Text className="text-gray-900 font-semibold text-sm">
                {deliveryRequest.estimatedDistance.toFixed(1)} km
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-2">Duration</Text>
              </View>
              <Text className="text-gray-900 font-semibold text-sm">
                ~{deliveryRequest.estimatedDuration} min
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="cash-outline" size={16} color="#22c55e" />
                <Text className="text-gray-600 text-sm ml-2">Delivery Fee</Text>
              </View>
              <Text className="text-green-600 font-bold text-lg">
                ₦{deliveryRequest.deliveryFee.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="px-6 py-4 flex-row gap-3">
            <TouchableOpacity
              onPress={handleDecline}
              className="flex-1 bg-gray-200 rounded-full py-4 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 font-bold text-base">Decline</Text>
            </TouchableOpacity>

            <Animated.View
              style={{ transform: [{ scale: pulseAnim }], flex: 1 }}
            >
              <TouchableOpacity
                onPress={handleAccept}
                className="bg-green-500 rounded-full py-4 items-center"
                activeOpacity={0.7}
              >
                <Text className="text-white font-bold text-base">Accept</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DeliveryAcceptanceModal;
