// Register.tsx
import React from "react";
import { View, TextInput, Pressable, Text, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerUserSchema,
  registerUserSchemaType,
} from "../../src/schemas/user.schema";
import { useRegisterMutation } from "../../src/hooks/useRegister";

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<registerUserSchemaType>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useRegisterMutation();

  const onSubmit = (data: registerUserSchemaType) => {
    mutateAsync(data);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-white rounded-lg p-4 shadow-md">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#6B7280"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white text-black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 mb-2 text-sm">
            {errors.name.message}
          </Text>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email"
              placeholderTextColor="#6B7280"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white text-black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mb-2 text-sm">
            {errors.email.message}
          </Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white text-black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 mb-2 text-sm">
            {errors.password.message}
          </Text>
        )}

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white text-black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 mb-3 text-sm">
            {errors.confirmPassword.message}
          </Text>
        )}

        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="bg-green-600 px-4 py-3 rounded-md items-center mt-2"
          disabled={isPending}
        >
          <Text className="text-white font-semibold text-lg">
            Create Account
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Register;
