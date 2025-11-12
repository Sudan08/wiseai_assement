import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useGetProperties } from "../../src/hooks/property/useGetProperties";
import PropertyCard from "../../src/components/common/PropertyCard";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PROPERTY_TYPES = ["house", "apartment", "townhouse"];
const STATUS_TYPES = ["available", "sold"];

export default function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useGetProperties({
    search,
    page: 1,
    limit: 10,
    filters: {
      city: city || undefined,
      type: propertyType || undefined,
      status: status || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    },
  });

  const propertyData = data?.data || [];

  // This is the component for the fully fixed (non-scrolling) expandable filters.
  const renderExpandableFilters = () => {
    if (!showFilters) return null;

    return (
      <View className="bg-gray-50 rounded-xl mx-4 p-4 mb-2 shadow-md">
        <Text className="text-sm mb-1">City</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2 mb-2"
          placeholder="Type city name..."
          placeholderTextColor={"#6B7280"}
          value={city}
          onChangeText={setCity}
        />

        {/* Property Type */}
        <Text className="text-sm mb-1">Property Type</Text>
        <View className="flex-row mb-2">
          {PROPERTY_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              className={`mr-3 px-3 py-1 rounded-full border ${
                propertyType === type
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-300 bg-white"
              }`}
              onPress={() => setPropertyType(type === propertyType ? "" : type)}
            >
              <Text
                className={
                  propertyType === type ? "text-white" : "text-gray-800"
                }
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status */}
        <Text className="text-sm mb-1">Status</Text>
        <View className="flex-row mb-2">
          {STATUS_TYPES.map((stat) => (
            <TouchableOpacity
              key={stat}
              className={`mr-3 px-3 py-1 rounded-full border ${
                status === stat
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-300 bg-white"
              }`}
              onPress={() => setStatus(status === stat ? "" : stat)}
            >
              <Text
                className={status === stat ? "text-white" : "text-gray-800"}
              >
                {stat.charAt(0).toUpperCase() + stat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Range */}
        <Text className="text-sm mb-1">Price Range ($)</Text>
        <View className="flex-row">
          <TextInput
            className="border border-gray-300 rounded px-3 py-2 mr-2 w-24"
            placeholder="Min"
            placeholderTextColor={"#6B7280"}
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <TextInput
            className="border border-gray-300 rounded px-3 py-2 w-24"
            placeholder="Max"
            placeholderTextColor={"#6B7280"}
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" style={{ marginTop: 32 }} />;
    }
    return (
      <Text className="text-center text-gray-400 mt-10">
        No properties found matching your criteria.
      </Text>
    );
  };

  const renderListSeparator = () => <View className="h-4" />;

  return (
    <View className="flex-1 bg-white">
      {/* 1. FIXED HEADER CONTAINER */}
      <View className="bg-white z-10 border-b border-gray-100 shadow-sm">
        {/* Search Bar and Toggle Button */}
        <View className="flex-row items-center px-4 pt-6 pb-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-base"
            placeholder="Search properties..."
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            placeholderTextColor={"#6B7280"}
          />
          <TouchableOpacity
            className="ml-3 px-3 py-2 border border-gray-300 rounded-lg"
            onPress={() => setShowFilters((open) => !open)}
          >
            <Ionicons name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Expandable Filters (Now fixed underneath the search bar) */}
        {renderExpandableFilters()}
      </View>

      {/* 2. SCROLLING CONTENT: FlatList */}
      <FlatList
        data={propertyData}
        renderItem={({ item }) => (
          <View>
            <PropertyCard
              property={item}
              onPress={() => {
                router.replace(`/(tabs)/${item.id}`);
              }}
            />
          </View>
        )}
        keyExtractor={(item) => String(item.id)}
        // Ensure there is no ListHeaderComponent so the list starts directly below the fixed header
        ListHeaderComponent={<View className="h-4" />}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={renderListSeparator}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        // Adjust content inset/padding to prevent content from being hidden by the fixed header
        // This is often needed in React Native but may not be necessary with a separate header View.
      />
    </View>
  );
}
