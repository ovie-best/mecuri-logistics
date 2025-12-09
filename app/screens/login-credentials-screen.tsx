import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { apiRequest, validateEmail } from "../utils/api-error-handler";
import { saveAuthToken, saveUserData, saveUserType, UserData } from "../utils/auth-storage";

export default function LoginCredentialsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const userType = params.userType as "merchant" | "customer";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const role = userType === "merchant" ? "driver" : "customer";

      console.log("Attempting login with:", {
        email,
        role,
        userType,
      });

      // Make API request with error handling
      const data = await apiRequest<{
        token?: string;
        access?: string;
        user?: UserData;
        [key: string]: any;
      }>(
        "http://10.10.30.42:8001/api/users/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        },
        15000 // 15 second timeout
      );

      console.log("Login successful:", data);

      // Store auth token (handle different token field names)
      const token = data.token || data.access;
      if (token) {
        await saveAuthToken(token);
      }

      // Store user data if available
      if (data.user) {
        await saveUserData(data.user);
      }

      // Store user type
      await saveUserType(userType);

      // Navigate based on user type
      if (userType === "merchant") {
        router.replace("/screens/merchant-welcome-screen");
      } else {
        router.replace("/screens/customer-home-screen");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Display user-friendly error message
      const errorMessage = error.message || "Invalid credentials. Please try again.";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push({
      pathname: "/screens/forgot-password-screen",
      params: { userType, email },
    });
  };

  const handleSocialLogin = (provider: "apple" | "google") => {
    Alert.alert("Coming Soon", `${provider} login will be available soon`);
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
          <View className="flex-1 justify-center px-8 py-8">
            {/* Title */}
            <Text className="text-2xl font-bold text-black text-center mb-8">
              Email Address
            </Text>

            {/* Email Input */}
            <TextInput
              className="bg-white rounded-2xl px-4 py-4 text-base mb-4"
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password Input */}
            <View className="relative mb-6">
              <TextInput
                className="bg-white rounded-2xl px-4 py-4 text-base pr-12"
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

            {/* Login Button */}
            <TouchableOpacity
              className="bg-black rounded-full py-4 items-center mb-4"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Login</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity onPress={handleForgotPassword} className="mb-6">
              <Text className="text-center text-black underline">
                Don&apos;t have access your login?
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-black/20" />
              <Text className="mx-4 text-black">OR</Text>
              <View className="flex-1 h-px bg-black/20" />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              className="border-2 border-black rounded-full py-3 mb-3 flex-row items-center justify-center"
              onPress={() => handleSocialLogin("apple")}
            >
              <Ionicons name="logo-apple" size={24} color="#000" />
              <Text className="text-black font-semibold ml-2">
                Sign in with Apple
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 border-black rounded-full py-3 mb-6 flex-row items-center justify-center"
              onPress={() => handleSocialLogin("google")}
            >
              <Ionicons name="logo-google" size={20} color="#000" />
              <Text className="text-black font-semibold ml-2">
                Sign in with Google
              </Text>
            </TouchableOpacity>

            {/* Wrong User Type Link */}
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-center text-black underline">
                I signed up wrong
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
