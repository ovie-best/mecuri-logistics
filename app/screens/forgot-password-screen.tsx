import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userType = params.userType as string;
  const emailParam = params.email as string;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState<"method" | "otp" | "newPassword">("method");
  const [otpMethod, setOTPMethod] = useState<"email" | "sms" | null>(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Countdown timer for OTP expiry
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const slideToNextStep = (nextStep: "method" | "otp" | "newPassword") => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_HEIGHT,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      slideAnim.setValue(SCREEN_HEIGHT);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSendOTP = async () => {
    if (!otpMethod) {
      Alert.alert("Error", "Please select how to receive OTP");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to send OTP
      // await fetch('YOUR_API_URL/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: emailParam,
      //     method: otpMethod,
      //     userType
      //   }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate: OTP sent successfully
      console.log(`OTP sent via ${otpMethod} to ${emailParam}`);

      setCountdown(60); // 60 seconds expiry
      slideToNextStep("otp");
    } catch (error) {
      console.error("Send OTP error:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleOTPChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

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
      Alert.alert("Error", "Please enter complete OTP");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to verify OTP
      // const response = await fetch('YOUR_API_URL/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: emailParam,
      //     otp: otpCode,
      //     userType
      //   }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate: OTP is correct (for testing, accept any 4 digits)
      console.log(`OTP verified: ${otpCode}`);

      slideToNextStep("newPassword");
    } catch (error) {
      console.error("Verify OTP error:", error);
      Alert.alert("Error", "Invalid OTP. Please try again.");
      setOtp(["", "", "", ""]);
      otpRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      Alert.alert("Please Wait", `You can resend OTP in ${countdown} seconds`);
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`OTP resent via ${otpMethod}`);
      setCountdown(60);
      setOtp(["", "", "", ""]);
      otpRefs[0].current?.focus();
      Alert.alert("Success", "OTP has been resent");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to reset password
      // await fetch('YOUR_API_URL/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: emailParam,
      //     newPassword,
      //     userType
      //   }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(`Password reset for ${emailParam}`);

      Alert.alert("Success", "Password reset successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to login screen
            router.replace({
              pathname: "/screens/login-credentials-screen",
              params: { userType },
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert("Error", "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-500" edges={["top"]}>
      <View className="flex-1 overflow-hidden">
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            flex: 1,
          }}
        >
          {/* Step 1: Select OTP Method */}
          {step === "method" && (
            <View className="flex-1 justify-center px-8">
              <Text className="text-xl font-bold text-black mb-8">
                How would you want to receive the OTP?
              </Text>

              <TouchableOpacity
                className="flex-row items-center mb-6"
                onPress={() => setOTPMethod("email")}
              >
                <View
                  className={`w-8 h-8 rounded-full border-2 items-center justify-center mr-4 ${
                    otpMethod === "email"
                      ? "border-black bg-white"
                      : "border-black bg-transparent"
                  }`}
                >
                  {otpMethod === "email" && (
                    <View className="w-4 h-4 bg-black rounded-full" />
                  )}
                </View>
                <Text className="text-black text-lg font-semibold">Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center mb-12"
                onPress={() => setOTPMethod("sms")}
              >
                <View
                  className={`w-8 h-8 rounded-full border-2 items-center justify-center mr-4 ${
                    otpMethod === "sms"
                      ? "border-black bg-white"
                      : "border-black bg-transparent"
                  }`}
                >
                  {otpMethod === "sms" && (
                    <View className="w-4 h-4 bg-black rounded-full" />
                  )}
                </View>
                <Text className="text-black text-lg font-semibold">SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`rounded-full py-4 items-center ${
                  otpMethod ? "bg-black" : "bg-gray-400"
                }`}
                onPress={handleSendOTP}
                disabled={loading || !otpMethod}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Send OTP
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-4 rounded-full py-4 items-center bg-transparent border-2 border-black"
                onPress={handleCancel}
              >
                <Text className="text-black font-bold text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Enter OTP */}
          {step === "otp" && (
            <View className="flex-1 justify-center px-8">
              <Text className="text-xl font-bold text-black text-center mb-8">
                Enter the OTP sent
              </Text>

              <View className="flex-row justify-center mb-4">
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={otpRefs[index]}
                    className="w-16 h-20 border-2 border-black rounded-2xl mx-2 text-center text-2xl font-bold bg-white"
                    value={digit}
                    onChangeText={(text) => handleOTPChange(text, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleOTPKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {countdown > 0 && (
                <Text className="text-center text-black text-sm mb-6">
                  Expires in {countdown} seconds
                </Text>
              )}

              <TouchableOpacity
                className="mb-8"
                onPress={handleResendOTP}
                disabled={countdown > 0}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    countdown > 0 ? "text-gray-600" : "text-black underline"
                  }`}
                >
                  Resend code
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-black rounded-full py-4 items-center"
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Confirm
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Step 3: New Password */}
          {step === "newPassword" && (
            <View className="flex-1 justify-center px-8">
              <Text className="text-xl font-bold text-black text-center mb-8">
                New Password
              </Text>

              <View className="mb-4">
                <Text className="text-black font-semibold mb-2">
                  New Password
                </Text>
                <TextInput
                  className="bg-white rounded-2xl px-4 py-4 text-base"
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-8">
                <Text className="text-black font-semibold mb-2">
                  Confirm New Password
                </Text>
                <TextInput
                  className="bg-white rounded-2xl px-4 py-4 text-base"
                  placeholder="Confirm new password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                className="bg-black rounded-full py-4 items-center"
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Save & Sign-in
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
