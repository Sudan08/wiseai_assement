import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "../enum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../hooks/auth/useAuth";
import { LoginResponse } from "../types";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export const axiosInstance = axios.create({
  baseURL: API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const userString = await AsyncStorage.getItem(STORAGE_KEY);
    if (userString) {
      const user = JSON.parse(userString) as LoginResponse;

      // Use refresh token for refresh endpoint, access token for others
      const token =
        config.url === API_ROUTES.AUTH_REFRESH
          ? user?.refreshToken
          : user?.accessToken;

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Call refresh endpoint
      const response = await axiosInstance.post<{
        accessToken: string;
        refreshToken: string;
      }>(API_ROUTES.AUTH_REFRESH, {});

      const { accessToken, refreshToken } = response.data;

      // Update stored tokens
      const userString = await AsyncStorage.getItem(STORAGE_KEY);
      if (userString) {
        const user = JSON.parse(userString) as LoginResponse;
        const updatedUser: LoginResponse = {
          ...user,
          accessToken,
          refreshToken,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      }

      // Retry original request with new token
      originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Clear storage on refresh failure
      await AsyncStorage.removeItem(STORAGE_KEY);
      return Promise.reject(refreshError);
    }
  }
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 0,
    },
  },
});
