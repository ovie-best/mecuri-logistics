// components/NavigationCard.tsx (for turn-by-turn)
import React from "react";
import { Text, View } from "react-native";

interface Props {
  title: string;
  directions: string[];
}

export default function NavigationCard({ title, directions }: Props) {
  return (
    <View className="absolute bottom-6 left-4 right-4 bg-white p-4 rounded-2xl shadow-lg">
      <Text className="text-lg font-bold">{title}</Text>
      {directions.map((dir, i) => (
        <Text key={i} className="mt-2 text-gray-700">
          ↑ {dir}
        </Text>
      ))}
    </View>
  );
}
