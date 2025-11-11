import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { API_ROUTES } from "../enum";
import { loginUserSchemaType } from "../schemas/user.schema"; // Assumes you have a login schema
import { LoginResponse, User } from "../types";
import { useAuth } from "./useAuth";
import { axiosInstance } from "../libs/client";
import { AxiosError } from "axios";

export const useLoginMutation = () => {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: loginUserSchemaType) => {
      return (
        await axiosInstance.post<LoginResponse>(API_ROUTES.AUTH_LOGIN, data)
      ).data;
    },
    onSuccess: (data: LoginResponse) => {
      login(data.user);
      router.replace("/(tabs)");
    },
    onError: (error: AxiosError) => {
      console.log(error.response?.data || error.message);
    },
  });
};
