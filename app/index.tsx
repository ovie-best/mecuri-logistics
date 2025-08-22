import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
// import { SignUpForm } from "./components/sign-up-form";
import { SignUpAs } from "./components/sign-up-as";

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

export default function Index() {
  const [showForm, setShowForm] = useState(false);

  // Animations
  const formY = useSharedValue(height); // start off-screen
  const mercuryScale = useSharedValue(1);
  const mercuryX = useSharedValue(0);
  const mercuryY = useSharedValue(0);

  const handleSignUpAs = () => {
    setShowForm(true);
    formY.value = withTiming(height / 3.8, { duration: 600 }); // move form to half screen
    mercuryScale.value = withTiming(0.7, { duration: 600 }); // shrink text

    // mercuryX.value = withTiming(120, { duration: 600 }); // move right
    // mercuryY.value = withTiming(230, { duration: 600 }); // move down

    mercuryX.value = withTiming(-120, { duration: 600 }); // move left
    mercuryY.value = withTiming(-200, { duration: 600 }); // move up
  };

  const closeForm = () => {
    formY.value = withTiming(height, { duration: 600 }, () => {
      // reset when finished
      runOnJS(setShowForm)(false);
    });
    mercuryScale.value = withTiming(1, { duration: 600 });
    mercuryX.value = withTiming(0, { duration: 600 });
    mercuryY.value = withTiming(0, { duration: 600 });
  };

  // Animated styles
  const formStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formY.value }],
  }));

  const mercuryStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: mercuryScale.value },
      { translateX: mercuryX.value },
      { translateY: mercuryY.value },
    ],
  }));

  return (
    <ImageBackground
      source={require("../assets/images/bg-motorbike.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="inset-0 bg-black/80 flex-1">
        <SafeAreaView className="flex-1">
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <View className="flex-1 items-center justify-center">
            <Animated.Image
              source={require("../assets/images/logo-with-tagline.png")}
              style={mercuryStyle}
              className="w-52"
              resizeMode="contain"
            />
          </View>

          <View className="items-center mb-10">
            <TouchableOpacity
              className="bg-green-500 w-60 py-3 rounded-full mb-4 items-center"
              onPress={handleSignUpAs}
            >
              <Text className="text-white text-base font-semibold">
                Sign-Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 w-60 py-3 rounded-full items-center">
              <Text className="text-white text-base font-semibold">Login</Text>
            </TouchableOpacity>
          </View>

          {/* Animated form */}
          {showForm && (
            <Pressable
              onPress={closeForm}
              className="absolute inset-0 bg-black/30" // semi-transparent overlay
            >
              <Animated.View
                style={[
                  formStyle,
                  {
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: height,
                  },
                ]}
                className="bg-green-500 rounded-t-3xl p-6"
              >
                <Pressable
                  className="flex-1"
                  onPress={(e) => e.stopPropagation()}
                >
                  <SignUpAs />
                </Pressable>
              </Animated.View>
            </Pressable>
          )}
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}
