import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState } from "react";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, where are you?", from: "user" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { id: Date.now(), text: input, from: "me" }]);
    setInput("");
  };

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            className={`p-3 my-2 rounded-xl ${
              item.from === "me"
                ? "bg-blue-600 self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            <Text className={item.from === "me" ? "text-white" : "text-black"}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View className="flex-row mt-auto">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type message..."
          className="flex-1 border border-gray-300 rounded-xl p-3"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="ml-2 bg-blue-600 p-3 rounded-xl"
        >
          <Text className="text-white font-bold">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
