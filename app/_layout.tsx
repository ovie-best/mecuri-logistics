import { RegistrationProvider } from "@/context/registration-context";
import { RideProvider } from "@/context/ride-context";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LocationProvider from "./context/LocationContext";
import "./globals.css";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <RegistrationProvider>
        <RideProvider>
          <LocationProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </LocationProvider>
        </RideProvider>
      </RegistrationProvider>
    </SafeAreaProvider>
  );
}
