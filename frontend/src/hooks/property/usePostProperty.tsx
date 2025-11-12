import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Property } from "../../types";
import { axiosInstance, queryClient } from "../../libs/client";
import { API_ROUTES } from "../../enum";
import { AxiosError } from "axios";
import { Alert } from "react-native";

export const usePostPropertyMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: any) => {
      return (await axiosInstance.post<Property>(API_ROUTES.PROPERTIES, data))
        .data;
    },
    onSuccess: (data: Property) => {
      console.log("Property created:", data);

      Alert.alert("Success", "Property posted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      queryClient.invalidateQueries({
        queryKey: ["properties", data.userId],
      });

      router.replace("/(tabs)/" + data.id);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.log(
        "Error creating property:",
        error.response?.data || error.message
      );
    },
  });
};
