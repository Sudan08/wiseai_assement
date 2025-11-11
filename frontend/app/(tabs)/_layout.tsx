import { useEffect } from "react";
import { useRouter } from "expo-router";
import Navbar from "../../src/components/Navbar";
import BottomTabs from "../../src/components/Tabs";
import { useAuth } from "../../src/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppContent() {
  return (
    <>
      <Navbar />
      <BottomTabs />
    </>
  );
}
