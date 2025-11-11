import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Types
interface Courier {
  id: string;
  name: string;
  rating: number;
  phone: string;
  avatar: string;
  amount: number;
  pickupAddress: string;
  dropoffAddress: string;
}

type RootDrawerParamList = {
  calling: { courier: Courier };
  "find-merchant": undefined;
};

type CallingScreenRouteProp = RouteProp<RootDrawerParamList, "calling">;
type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;

const CallingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CallingScreenRouteProp>();
  const { courier } = route.params;

  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(false);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Pulse animation for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = (): void => {
    navigation.goBack();
  };

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = (): void => {
    setIsSpeaker(!isSpeaker);
  };

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" backgroundColor="#22c55e" />

      {/* Content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Avatar with pulse animation */}
        <Animated.View
          style={{ transform: [{ scale: pulseAnim }] }}
          className="w-32 h-32 bg-orange-300 rounded-full items-center justify-center mb-8"
        >
          <Text className="text-white text-5xl">👤</Text>
        </Animated.View>

        {/* Call Status */}
        <Text className="text-white text-3xl font-bold mb-2">Calling...</Text>

        {/* Courier Name */}
        <Text className="text-white text-2xl font-semibold mb-4">
          {courier.name}
        </Text>

        {/* Call Duration */}
        <Text className="text-white/80 text-lg">
          {formatDuration(callDuration)}
        </Text>
      </View>

      {/* Control Buttons */}
      <View className="px-8 pb-16">
        <View className="flex-row items-center justify-around mb-12">
          {/* Speaker Button */}
          <TouchableOpacity
            onPress={toggleSpeaker}
            className={`items-center ${isSpeaker ? "opacity-100" : "opacity-60"}`}
          >
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-2">
              <Icon
                name={isSpeaker ? "volume-high" : "volume-medium"}
                size={28}
                color="#fff"
              />
            </View>
            <Text className="text-white text-sm">Speaker</Text>
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity onPress={handleEndCall} className="items-center">
            <View className="w-20 h-20 bg-red-500 rounded-full items-center justify-center mb-2 shadow-lg">
              <Icon
                name="call"
                size={32}
                color="#fff"
                style={{ transform: [{ rotate: "135deg" }] }}
              />
            </View>
          </TouchableOpacity>

          {/* Mute Button */}
          <TouchableOpacity
            onPress={toggleMute}
            className={`items-center ${isMuted ? "opacity-100" : "opacity-60"}`}
          >
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-2">
              <Icon name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
            </View>
            <Text className="text-white text-sm">Mute</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CallingScreen;
