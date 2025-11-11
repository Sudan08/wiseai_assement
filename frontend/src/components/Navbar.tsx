import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Navbar = () => {
  const router = useRouter();
  return (
    <View className="w-full bg-white ">
      <View className="px-4 py-3 flex-row items-center justify-between w-full">
        <Text className="text-xl tracking font-bold text-black">Wise AI</Text>

        <Pressable
          className="p-2 rounded-full"
          android_ripple={{ color: "#e5e7eb" }}
          onPress={() => {
            router.push("profile");
          }}
        >
          <Ionicons name="person-circle-outline" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

export default Navbar;
