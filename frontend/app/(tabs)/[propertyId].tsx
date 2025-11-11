import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useGetProperty } from "../../src/hooks/useGetProperty";
import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "../../src/hooks/useAuth"; // Uncomment if you need user info

const PropertyDetailPage = () => {
  const { propertyId } = useLocalSearchParams();
  const { data: property, isLoading } = useGetProperty(propertyId as string);
  const { width } = useWindowDimensions();
  // const { user } = useAuth(); // Uncomment if you want to check user

  const [favoLoading, setFavoLoading] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);

  // Dummy function for favourite, you should replace with mutation/query
  const handleFavourite = async () => {
    try {
      setFavoLoading(true);
      // Here, you would call your API/mutation to add/remove favourite
      // await addFavourite(propertyId, user.id);

      setTimeout(() => {
        setIsFavourited((f) => !f);
        setFavoLoading(false);
        Alert.alert(
          isFavourited ? "Removed from Favourites" : "Added to Favourites"
        );
      }, 700); // Simulate network delay
    } catch (e) {
      setFavoLoading(false);
      Alert.alert("Error", "Could not update favourites");
    }
  };

  if (isLoading) {
    return <View className={`bg-gray-200 rounded w-full h-96 p-4`} />;
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Images Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        className="w-full h-64"
      >
        {property?.images.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img }}
            style={{
              width: width * 0.9,
              height: "100%",
              borderRadius: 16,
              marginLeft: idx === 0 ? 16 : 0,
              marginRight: idx === property.images.length - 1 ? 16 : 8,
            }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Favourite Button */}

      <View className="flex-1 flex flex-row justify-between w-full items-center">
        {/* Title, price, status */}
        <View className="px-6 mt-5 mb-3 flex-1">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {property?.title}
          </Text>
          <View className="flex-row items-center mb-3">
            <Text className="text-green-700 text-xl font-bold mr-4">
              ${property?.price.toLocaleString()}
            </Text>
            <Text
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                property?.status === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {property?.status &&
                property?.status.charAt(0).toUpperCase() +
                  property?.status.slice(1)}
            </Text>
          </View>
          <Text className="text-sm text-gray-700 mb-1">
            {property?.address}, {property?.city}, {property?.state}{" "}
            {property?.zipCode}
          </Text>
        </View>
        <View className="px-6 flex-row mt-3 justify-end">
          <TouchableOpacity
            className={`px-5 py-2 rounded-full border-2 flex-row items-center ${
              isFavourited
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
            activeOpacity={0.8}
            onPress={handleFavourite}
            disabled={favoLoading}
          >
            {favoLoading ? (
              <ActivityIndicator size={20} color="#f43f5e" />
            ) : (
              <Ionicons
                name={isFavourited ? "heart" : "heart-outline"}
                size={20}
                color={isFavourited ? "#f43f5e" : "#6b7280"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Property info stats */}
      <View className="flex-row justify-between md:justify-start gap-6 px-6 mt-2 mb-2">
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-800">
            🛏 {property?.bedrooms}
          </Text>
          <Text className="text-xs text-gray-500">Bedrooms</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-800">
            🛁 {property?.bathrooms}
          </Text>
          <Text className="text-xs text-gray-500">Bathrooms</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-800">
            📐 {property?.area} sqft
          </Text>
          <Text className="text-xs text-gray-500">Area</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs font-semibold text-blue-600 uppercase">
            {property?.propertyType}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="w-11/12 self-center h-0.5 bg-gray-200 rounded-full my-4" />

      {/* Description */}
      <View className="px-6 mb-4">
        <Text className="text-base font-semibold text-gray-900 mb-2">
          Description
        </Text>
        <Text className="text-gray-700 text-base">{property?.description}</Text>
      </View>

      {/* Divider */}
      <View className="w-11/12 self-center h-0.5 bg-gray-200 rounded-full my-4" />

      {/* Owner Information */}
      <View className="px-6">
        <Text className="text-sm text-gray-500 mb-1">Listed by:</Text>
        <View className="flex-row items-center mb-1">
          <Text className="font-semibold text-gray-900">
            {property?.user.name}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">{property?.user.email}</Text>
      </View>

      {/* Dates */}
      <View className="px-6 mt-4 flex-row justify-between">
        <Text className="text-xs text-gray-400">
          Created:{" "}
          {property && new Date(property?.createdAt).toLocaleDateString()}
        </Text>
        <Text className="text-xs text-gray-400">
          Updated:{" "}
          {property && new Date(property?.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

export default PropertyDetailPage;
