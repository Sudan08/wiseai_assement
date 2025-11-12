// Login.tsx
import React from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginUserSchema,
  loginUserSchemaType,
} from "../../src/schemas/user.schema";
import { useLoginMutation } from "../../src/hooks/auth/useLogin";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<loginUserSchemaType>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useLoginMutation();

  const onSubmit = (data: loginUserSchemaType) => {
    mutateAsync(data);
  };

  return (
    <View className="flex-1 bg-white rounded-lg p-4 shadow-md">
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            placeholderTextColor="#6B7280"
            className="border border-gray-300 rounded-md px-3 py-2 mb-3 bg-white text-black"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && (
        <Text className="text-red-500 mb-2">{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            className="border border-gray-300 rounded-md px-3 py-2 mb-4 bg-white text-black"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && (
        <Text className="text-red-500 mb-2">{errors.password.message}</Text>
      )}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className={`rounded-xl py-4 items-center shadow-sm ${
          isPending ? "bg-blue-400" : "bg-blue-600"
        }`}
        disabled={isPending}
      >
        <Text> {isPending ? "Logging in..." : "Login"} </Text>
      </Pressable>
    </View>
  );
};

export default Login;
