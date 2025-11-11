import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Property } from "../../types";

const PropertyCard = ({
  property,
  onPress,
}: {
  property: Property;
  onPress: () => void;
}) => {
  const imageUrl =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://via.placeholder.com/800x600?text=No+Image";

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl shadow-md my-4 mx-4 overflow-hidden"
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-44 bg-gray-200"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text
          numberOfLines={1}
          className="text-lg font-semibold text-neutral-900 mb-1"
        >
          {property.title}
        </Text>
        <Text numberOfLines={1} className="text-sm text-neutral-600 mb-2">
          {property.address}, {property.city}
        </Text>
        <Text className="text-green-700 text-base font-bold mb-3">
          ${property.price.toLocaleString()}
        </Text>
        <View className="flex-row mb-2 space-x-4">
          <Text className="text-sm text-neutral-700">
            🛏 {property.bedrooms}
          </Text>
          <Text className="text-sm text-neutral-700">
            🛁 {property.bathrooms}
          </Text>
          <Text className="text-sm text-neutral-700">
            📐 {property.area} sqft
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs font-semibold tracking-wider uppercase text-blue-600">
            {property.propertyType}
          </Text>
          <Text
            className={`text-xs font-bold rounded-full px-2 py-0.5 ${
              property.status === "available"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PropertyCard;
