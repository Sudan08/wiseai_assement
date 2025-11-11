import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Pressable, ImageBackground } from "react-native";

const Onboarding = () => {
  const router = useRouter();

  const navigateLogin = () => {
    router.push("login");
  };

  const navigateRegister = () => {
    router.push("register");
  };

  return (
    <ImageBackground
      source={require("../assets/img/login.jpg")}
      className="flex-1 w-full h-full"
      resizeMode="cover"
    >
      <View className="flex-1 justify-between items-center px-4 py-12">
        {/* Middle text */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-3xl font-bold text-center">
            Welcome to Wise AI
          </Text>
        </View>

        {/* Bottom buttons */}
        <View className="w-full">
          <Pressable onPress={navigateRegister} className="bg-blue-800 h-16 w-full rounded-md items-center justify-center mb-4">
            <Text className="text-white text-xl">Register</Text>
          </Pressable>
          <View className="flex-row justify-center items-center">
            <Text className="text-white mr-2">Already have an account?</Text>
            <Pressable onPress={navigateLogin}>
              <Text className="text-blue-400 font-bold underline">Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Onboarding;
