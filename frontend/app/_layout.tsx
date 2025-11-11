import { AuthProvider, useAuth } from "../src/hooks/useAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/libs/client";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { FavouriteProvider } from "../src/hooks/favourite/useFavourite";

function RootLayoutContent() {
  const { data, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!data}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!!data}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavouriteProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <RootLayoutContent />
          </SafeAreaView>
        </FavouriteProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
