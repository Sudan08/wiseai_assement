import React from "react";
import { AuthProvider } from "../src/hooks/useAuth";
import "../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/libs/client";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView className="flex-1">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </Stack>
        </SafeAreaView>
      </QueryClientProvider>
    </AuthProvider>)
};

export default RootLayout;
