// context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  use,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse, User } from "../types";
import { useRouter } from "expo-router";

export const STORAGE_KEY = "@user";

interface AuthContextType {
  data: LoginResponse | null;
  loading: boolean;
  login: (userData: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue) setData(JSON.parse(jsonValue));
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData: LoginResponse) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setData(userData);
    } catch (e) {
      console.error("Failed to save user", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setData(null);
      router.replace("/(auth)/login");
    } catch (e) {
      console.error("Failed to remove user", e);
    }
  };

  return (
    <AuthContext.Provider value={{ data, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
