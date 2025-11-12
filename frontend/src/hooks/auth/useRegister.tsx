import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { axiosInstance } from "../../libs/client";
import { API_ROUTES } from "../../enum";
import { registerUserSchemaType } from "../../schemas/user.schema";
import { LoginResponse } from "../../types";
import { useAuth } from "./useAuth";
import { Alert } from "react-native";

export const useRegisterMutation = () => {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: registerUserSchemaType) => {
      return (
        await axiosInstance.post<LoginResponse>(API_ROUTES.AUTH_REGISTER, data)
      ).data;
    },
    onSuccess: (data: LoginResponse) => {
      Alert.alert("Success", "Registration successful!");
      router.replace("/(auth)/login");
    },
    onError: (error: any) => {
      console.log(error.response?.data || error.message);
    },
  });
};
