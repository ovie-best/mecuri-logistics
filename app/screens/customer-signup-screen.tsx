import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MerchantSignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSignUp = async () => {
    // Validation
    if (!email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!validatePhone(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_URL/auth/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email,
      //     phoneNumber,
      //     password,
      //     userType: 'merchant',
      //   }),
      // });
      // const data = await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/screens/merchant-welcome-screen"),
        },
      ]);
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInPress = () => {
    router.push("/screens/login-screen");
  };

  const handleAppleSignup = () => {
    Alert.alert("Coming Soon", "Sign up with Apple will be available soon");
  };

  const handleGoogleSignup = () => {
    Alert.alert("Coming Soon", "Sign up with Google will be available soon");
  };

  return (
    <SafeAreaView className="flex-1 bg-green-500" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-8 py-8">
            {/* Title */}
            <Text className="text-3xl font-bold text-black text-center mb-8">
              Sign Up
            </Text>

            {/* Email Address */}
            <View className="mb-4">
              <Text className="text-black font-semibold mb-2">
                Email Address
              </Text>
              <TextInput
                className="bg-gray-100 rounded-2xl px-4 py-4 text-base"
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Phone Number */}
            <View className="mb-4">
              <Text className="text-black font-semibold mb-2">
                Phone Number
              </Text>
              <TextInput
                className="bg-gray-100 rounded-2xl px-4 py-4 text-base"
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-black font-semibold mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-gray-100 rounded-2xl px-4 py-4 text-base pr-12"
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-black font-semibold mb-2">
                Confirm Password
              </Text>
              <View className="relative">
                <TextInput
                  className="bg-gray-100 rounded-2xl px-4 py-4 text-base pr-12"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              className="bg-black rounded-full py-4 items-center mb-4"
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Sign up</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <TouchableOpacity onPress={handleSignInPress} className="mb-6">
              <Text className="text-center text-black">
                Already have an account?{" "}
                <Text className="font-bold underline">Sign in</Text>
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-black/20" />
              <Text className="mx-4 text-black">OR</Text>
              <View className="flex-1 h-px bg-black/20" />
            </View>

            {/* Social Sign Up Buttons */}
            <TouchableOpacity
              className="border-2 border-black rounded-full py-3 mb-3 flex-row items-center justify-center"
              onPress={handleAppleSignup}
            >
              <Ionicons name="logo-apple" size={24} color="#000" />
              <Text className="text-black font-semibold ml-2">
                Sign up with Apple
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 border-black rounded-full py-3 mb-4 flex-row items-center justify-center"
              onPress={handleGoogleSignup}
            >
              <Ionicons name="logo-google" size={20} color="#000" />
              <Text className="text-black font-semibold ml-2">
                Sign up with Google
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
