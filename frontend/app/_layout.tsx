import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../global.css";
import { AuthProvider } from "../src/hooks/useAuth";
import BottomTabs from "../src/components/Tabs";

export default function RootLayout() {
  return (
    <AuthProvider>
      <BottomTabs />
    </AuthProvider>
  );
}
