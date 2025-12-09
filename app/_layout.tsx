import { RegistrationProvider } from "@/context/registration-context";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DeliveryProvider } from "@/context/delivery-context";
import LocationProvider from "./context/LocationContext";
import "./globals.css";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <RegistrationProvider>
        <LocationProvider>
          <DeliveryProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </DeliveryProvider>
        </LocationProvider>
      </RegistrationProvider>
    </SafeAreaProvider>
  );
}
