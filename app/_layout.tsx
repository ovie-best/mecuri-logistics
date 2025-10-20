import { Stack } from "expo-router";

import { RegistrationProvider } from "@/context/registration-context";
import { RideProvider } from "@/context/ride-context";
import "./globals.css";

export default function Layout() {
  return (
    <RegistrationProvider>
      <RideProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </RideProvider>
    </RegistrationProvider>
  );
}
