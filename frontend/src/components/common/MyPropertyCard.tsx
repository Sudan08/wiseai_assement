import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Property } from "../../types";

interface MyPropertyCardProps {
  property: Property;
  onView?: () => void;
  onEdit: () => void;
  onDeletePress: () => void;
}

const MyPropertyCard: React.FC<MyPropertyCardProps> = ({
  property,
  onView,
  onEdit,
  onDeletePress,
}) => {
  const imageUrl =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://via.placeholder.com/800x600?text=No+Image";

  return (
    <View className="bg-white rounded-2xl shadow-md mb-4 overflow-hidden">
      {/* Image Section with Status Badge */}
      <TouchableOpacity onPress={onView} activeOpacity={0.9}>
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-48 bg-gray-200"
            resizeMode="cover"
          />

          {/* Status Badge */}
          <View className="absolute top-3 right-3">
            <View
              className={`rounded-full px-3 py-1.5 shadow-md ${
                property.status === "available"
                  ? "bg-green-500"
                  : property.status === "sold"
                  ? "bg-red-500"
                  : property.status === "pending"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            >
              <Text className="text-white text-xs font-bold uppercase">
                {property.status}
              </Text>
            </View>
          </View>

          {/* Property Type Badge */}
          <View className="absolute bottom-3 left-3">
            <View className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <Text className="text-white text-xs font-semibold uppercase tracking-wide">
                {property.propertyType}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Content Section */}
      <View className="p-4">
        {/* Title */}
        <Text
          numberOfLines={2}
          className="text-lg font-bold text-neutral-900 mb-2"
        >
          {property.title}
        </Text>

        {/* Address */}
        <View className="flex-row items-start mb-3">
          <Ionicons name="location" size={16} color="#6B7280" />
          <Text
            numberOfLines={1}
            className="text-sm text-neutral-600 ml-1 flex-1"
          >
            {property.address}, {property.city}, {property.state}
          </Text>
        </View>

        {/* Price */}
        <Text className="text-green-600 text-2xl font-bold mb-4">
          ${property.price.toLocaleString()}
        </Text>

        {/* Property Details Grid */}
        <View className="flex-row justify-between mb-4 bg-gray-50 rounded-xl p-3">
          <View className="items-center">
            <View className="flex-row items-center mb-1">
              <Ionicons name="bed" size={18} color="#3B82F6" />
              <Text className="text-neutral-900 font-bold ml-1">
                {property.bedrooms}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">Beds</Text>
          </View>

          <View className="w-px bg-gray-300" />

          <View className="items-center">
            <View className="flex-row items-center mb-1">
              <Ionicons name="water" size={18} color="#3B82F6" />
              <Text className="text-neutral-900 font-bold ml-1">
                {property.bathrooms}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">Baths</Text>
          </View>

          <View className="w-px bg-gray-300" />

          <View className="items-center">
            <View className="flex-row items-center mb-1">
              <Ionicons name="resize" size={18} color="#3B82F6" />
              <Text className="text-neutral-900 font-bold ml-1">
                {property.area}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">sqft</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-3 gap-3">
          {/* Edit Button */}
          <TouchableOpacity
            className="flex-1 bg-blue-600 rounded-xl py-3.5 flex-row items-center justify-center shadow-sm"
            onPress={onEdit}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text className="text-white font-bold ml-2 text-base">Edit</Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            className="flex-1 bg-red-600 rounded-xl py-3.5 flex-row items-center justify-center shadow-sm"
            onPress={onDeletePress}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text className="text-white font-bold ml-2 text-base">Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        {property.description && (
          <View className="mt-3 pt-3 border-t border-gray-200">
            <Text numberOfLines={2} className="text-sm text-gray-600">
              {property.description}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyPropertyCard;
