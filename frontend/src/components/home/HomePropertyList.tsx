import React from "react";
import { View } from "react-native";
import PropertyCardSkeleton from "../common/SkeletonPropertyCard";
import PropertyCard from "../common/PropertyCard";
import { Property } from "../../types";
import { router } from "expo-router";
import { useGetRecommendedProperty } from "../../hooks/property/useGetRecommendedProperty";

const HomePropertyList = () => {
  const { data, isLoading, error } = useGetRecommendedProperty();

  const propertyData = data?.data || [];

  if (isLoading) {
    return <PropertyCardSkeleton />;
  }

  return (
    <View className="flex flex-col gap-3  my-2 flex-1 w-full h-full">
      {propertyData.map((item: Property) => (
        <PropertyCard
          property={item}
          key={item.id}
          onPress={() => {
            router.push("/(tabs)/" + item.id);
          }}
        />
      ))}
    </View>
  );
};

export default HomePropertyList;
