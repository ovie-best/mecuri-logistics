import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // OTP Input Refs
  const otpRefs = [
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
    React.useRef<TextInput>(null),
  ];

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setSending(true);
    try {
      // Replace with your actual API endpoint
      // await fetch('YOUR_API_URL/auth/send-otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({ email }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowOTPModal(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send verification code");
    } finally {
      setSending(false);
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      Alert.alert("Error", "Please enter the complete OTP code");
      return;
    }

    setVerifying(true);
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/auth/verify-otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({ email, otp: otpCode }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowOTPModal(false);
      setShowNewPasswordModal(true);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Invalid verification code");
    } finally {
      setVerifying(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setUpdating(true);
    try {
      // Replace with your actual API endpoint
      // await fetch('YOUR_API_URL/auth/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      //   body: JSON.stringify({
      //     oldPassword,
      //     newPassword,
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Password changed successfully", [
        {
          text: "OK",
          onPress: () => {
            setShowNewPasswordModal(false);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-8">
        <Text className="text-sm text-gray-600 mb-6">
          Input your email to receive OTP code
        </Text>

        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3 text-base mb-6"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          className="bg-green-500 rounded-full py-4 items-center"
          onPress={handleSendCode}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Send Code
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* OTP Modal */}
      <Modal
        visible={showOTPModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOTPModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-lg font-semibold mb-2 text-center">
              OTP Code
            </Text>
            <Text className="text-sm text-gray-600 mb-6 text-center">
              Enter the verification code we just sent to your email
            </Text>

            {/* OTP Input */}
            <View className="flex-row justify-center mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={otpRefs[index]}
                  className="w-16 h-16 border-2 border-gray-300 rounded-xl mx-2 text-center text-2xl font-bold"
                  value={digit}
                  onChangeText={(text) => handleOTPChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleOTPKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                />
              ))}
            </View>

            <Text className="text-xs text-gray-500 text-center mb-6">CODE</Text>

            <TouchableOpacity
              className="bg-green-500 rounded-full py-3 items-center"
              onPress={handleVerifyOTP}
              disabled={verifying}
            >
              {verifying ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Password Modal */}
      <Modal
        visible={showNewPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNewPasswordModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-lg font-semibold mb-6 text-center">
              Change Password
            </Text>

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">Old Password</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                placeholder="Enter old password"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">New Password</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm text-gray-600 mb-2">
                Confirm New Password
              </Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="bg-green-500 rounded-full py-3 items-center"
              onPress={handleUpdatePassword}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  Save & Re-Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
