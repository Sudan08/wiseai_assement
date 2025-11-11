import { View, Text, Image, ScrollView } from "react-native";
import HomePropertyList from "../../src/components/home/HomePropertyList";
import { useAuth } from "../../src/hooks/useAuth";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";

export default function HomeScreen() {
  return (
    <ScrollView
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="w-full items-center p-4">
        <Image
          source={require("../../assets/img/home.png")}
          className="w-full h-56 rounded-lg"
          style={{ width: "100%", height: 224 }}
          resizeMode="cover"
        />
      </View>
      <View className="flex flex-1 p-4 w-full h-full">
        <Text className="text-3xl font-semibold w-3/4 text-black">
          Get Started,
        </Text>
        <Text className="text-3xl font-semibold w-3/4 text-black">
          Find your Dream Home Now.
        </Text>
      </View>
      <HomePropertyList />
    </ScrollView>
  );
}
