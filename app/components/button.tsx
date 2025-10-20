import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

export default function Button({
  children,
  ...props
}: TouchableOpacityProps & { children: React.ReactNode }) {
  return (
    <TouchableOpacity
      {...props}
      className="bg-green-500 py-3 rounded-2xl items-center justify-center my-4"
    >
      <Text className="text-white font-semibold">{children}</Text>
    </TouchableOpacity>
  );
}
