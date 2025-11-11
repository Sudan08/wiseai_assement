import { useEffect } from "react";
import { useRouter } from "expo-router";
import Navbar from "../../src/components/Navbar";
import BottomTabs from "../../src/components/Tabs";
import { useAuth } from "../../src/hooks/useAuth";

export default function AppContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <>
      <Navbar />
      <BottomTabs />
    </>
  );
}
