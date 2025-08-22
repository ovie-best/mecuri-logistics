import { AntDesign } from "@expo/vector-icons";
import { Apple } from "lucide-react-native";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpForm() {
  return (
    <View className="flex-1">
      <Text className="text-center text-xl font-bold text-black mb-4">
        Sign Up
      </Text>

      <View className="space-y-3">
        <TextInput
          placeholder="Email Address"
          className="bg-gray-100 rounded-lg px-4 py-3 mb-5"
        />
        <TextInput
          placeholder="Phone Number"
          className="bg-gray-100 rounded-lg px-4 py-3 mb-5"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="bg-gray-100 rounded-lg px-4 py-3 mb-5"
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          className="bg-gray-100 rounded-lg px-4 py-3 mb-5"
        />
      </View>

      <TouchableOpacity className="bg-black rounded-full py-4 mt-6">
        <Text className="text-white text-center font-bold ">Sign up</Text>
      </TouchableOpacity>

      <View>
        <Text className="text-center mt-2">
          Already have an account? Sign in{" "}
        </Text>
      </View>

      <View className="w-full px-6 mt-6">
        {/* Divider with OR */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-2 text-gray-500">OR</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        {/* Apple Button */}
        <TouchableOpacity className="flex-row items-center justify-center border border-gray-400 rounded-full py-3 mb-3">
          <Apple size={22} color="black" />
          <Text className="ml-2 text-black font-medium">
            Sign up with Apple
          </Text>
        </TouchableOpacity>

        {/* Google Button */}
        <TouchableOpacity className="flex-row items-center justify-center border border-gray-400 rounded-full py-3 mb-15">
          <AntDesign name="google" size={20} color="#DB4437" />
          <Text className="ml-2 text-black font-medium">
            Sign up with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
