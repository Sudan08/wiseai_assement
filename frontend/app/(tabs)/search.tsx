import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useInfiniteProperties } from "../../src/hooks/property/useInfiniteProperties";
import PropertyCard from "../../src/components/common/PropertyCard";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PROPERTY_TYPES = [
  "apartment",
  "house",
  "condo",
  "villa",
  "townhouse",
  "studio",
];
const STATUS_TYPES = ["available", "sold", "pending"];

export default function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteProperties({
    search,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    filters: {
      city: city || undefined,
      propertyType: propertyType || undefined, // Changed from 'type'
      status: status || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    },
  });

  // Flatten all pages into a single array
  const allProperties = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // Get total count from the first page
  const totalCount = data?.pages[0]?.total || 0;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

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
        <View className="flex-row mb-2 flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type, index) => (
            <TouchableOpacity
              key={index}
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
          {STATUS_TYPES.map((stat, index) => (
            <TouchableOpacity
              key={index}
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
    return (
      <View className="items-center justify-center py-20">
        <Ionicons name="home-outline" size={64} color="#D1D5DB" />
        <Text className="text-center text-gray-400 mt-4 text-base">
          No properties found matching your criteria.
        </Text>
        <Text className="text-center text-gray-400 text-sm px-8 mt-2">
          Try adjusting your filters or search terms.
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
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

        {/* Expandable Filters */}
        {renderExpandableFilters()}
      </View>

      {/* 2. SCROLLING CONTENT: FlatList with Infinite Scroll */}
      <FlatList
        data={allProperties}
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
        keyExtractor={(_, index) => String(index)}
        ListHeaderComponent={<View className="h-4" />}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderListSeparator}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={refetch}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />

      {/* Results counter */}
      {allProperties.length > 0 && (
        <View className="absolute bottom-4 right-4 bg-blue-600 px-4 py-2 rounded-full shadow-lg">
          <Text className="text-white font-semibold text-sm">
            {allProperties.length} / {totalCount} properties
          </Text>
        </View>
      )}
    </View>
  );
}
