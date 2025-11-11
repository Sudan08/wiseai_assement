import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { API_URL, axiosInstance } from "../libs/client";
import { API_ROUTES } from "../enum";
import { registerUserSchemaType } from "../schemas/user.schema";
import { User } from "../types";
import { useAuth } from "./useAuth";
import { AxiosError, AxiosResponse } from "axios";

export const useRegisterMutation = () => {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: registerUserSchemaType) => {
      return (await axiosInstance.post<User>(API_ROUTES.AUTH_REGISTER, data))
        .data;
    },
    onSuccess: (data: User) => {
      login(data);
      router.replace("/(tabs)/(index)");
    },
    onError: (error: any) => {
      console.log(error.response?.data || error.message);
    },
  });
};
