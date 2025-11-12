import React from "react";
import { FlatList, View } from "react-native";
import { useGetProperties } from "../../hooks/property/useGetProperties";
import PropertyCardSkeleton from "../common/SkeletonPropertyCard";
import PropertyCard from "../common/PropertyCard";
import { Property } from "../../types";
import { router } from "expo-router";

const HomePropertyList = () => {
  const { data, isLoading } = useGetProperties({ page: 1, limit: 5 });

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
